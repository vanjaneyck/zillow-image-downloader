from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from bs4 import BeautifulSoup
import re
from typing import List, Optional
import asyncio
from PIL import Image
from io import BytesIO

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

class ImageInfo(BaseModel):
    url: str
    thumbnail: str
    width: Optional[int] = None
    height: Optional[int] = None
    size: Optional[str] = None

class ScrapeResponse(BaseModel):
    images: List[ImageInfo]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.zillow.com/'
}

async def fetch_with_retry(url: str, max_retries: int = 3) -> str:
    async with httpx.AsyncClient() as client:
        for attempt in range(max_retries):
            try:
                response = await client.get(url, headers=HEADERS, timeout=30.0)
                response.raise_for_status()
                return response.text
            except Exception as e:
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=500, detail=str(e))
                await asyncio.sleep(1)

async def get_image_info(url: str) -> Optional[ImageInfo]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=HEADERS)
            if response.status_code != 200:
                return None
                
            img = Image.open(BytesIO(response.content))
            size = len(response.content)
            
            return ImageInfo(
                url=url,
                thumbnail=url.replace('_f.', '_a.'),
                width=img.width,
                height=img.height,
                size=f"{size / 1024:.1f}KB"
            )
    except Exception as e:
        print(f"Error getting image info: {e}")
        return None

def extract_zpid(url: str) -> Optional[str]:
    match = re.search(r'/(\d+)_zpid', url)
    return match.group(1) if match else None

def parse_gallery_html(html: str, zpid: str) -> List[str]:
    soup = BeautifulSoup(html, 'html.parser')
    images = set()
    
    # Extract from picture elements
    for picture in soup.find_all('picture'):
        for source in picture.find_all('source'):
            srcset = source.get('srcset', '')
            if 'zillowstatic.com' in srcset:
                urls = [
                    url.strip().split(' ')[0] 
                    for url in srcset.split(',')
                    if 'zillowstatic.com' in url
                ]
                for url in urls:
                    base_url = url.replace('//', 'https://')
                    image_url = re.sub(r'(_[a-z]+)?\.(?:jpg|webp)', '_f.webp', base_url)
                    images.add(image_url)
    
    # If no images found, try direct URLs
    if not images:
        base_url = f"https://photos.zillowstatic.com/fp/{zpid}"
        for i in range(20):  # Try first 20 images
            images.add(f"{base_url}-{i}_f.webp")
    
    return list(images)

@app.post("/scrape", response_model=ScrapeResponse)
async def scrape_images(request: ScrapeRequest):
    if not request.url or 'zillow.com/homedetails' not in request.url:
        raise HTTPException(status_code=400, detail="Invalid Zillow URL")
    
    zpid = extract_zpid(request.url)
    if not zpid:
        raise HTTPException(status_code=400, detail="Could not extract ZPID from URL")
    
    try:
        html = await fetch_with_retry(request.url)
        image_urls = parse_gallery_html(html, zpid)
        
        # Get image info concurrently
        tasks = [get_image_info(url) for url in image_urls]
        images = await asyncio.gather(*tasks)
        
        # Filter out None values and duplicates
        valid_images = []
        seen_urls = set()
        for img in images:
            if img and img.url not in seen_urls:
                valid_images.append(img)
                seen_urls.add(img.url)
        
        if not valid_images:
            raise HTTPException(status_code=404, detail="No images found")
        
        return ScrapeResponse(images=valid_images)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)