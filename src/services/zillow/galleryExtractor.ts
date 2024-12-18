import { ImageItem } from './types';
import { ZillowError } from './errors';

const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

export async function extractGalleryImages(url: string): Promise<ImageItem[]> {
  if (!url.includes('zillow.com/homedetails')) {
    throw new ZillowError('INVALID_URL', 'Lütfen geçerli bir Zillow emlak ilanı URL\'si girin');
  }

  try {
    const html = await fetchWithProxy(url);
    const images = parseGalleryImages(html);

    if (images.length === 0) {
      throw new ZillowError('NO_IMAGES', 'Bu emlak ilanında görsel bulunamadı');
    }

    return images;
  } catch (error) {
    console.error('Gallery extraction error:', error);
    throw error instanceof ZillowError ? error : new ZillowError('FETCH_ERROR', 'Görsel yüklenirken bir hata oluştu');
  }
}

async function fetchWithProxy(url: string): Promise<string> {
  let lastError: Error | null = null;

  for (const proxy of PROXY_URLS) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
        }
      });

      if (!response.ok) continue;
      const html = await response.text();
      if (html.includes('zillow.com')) {
        return html;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Network error');
      continue;
    }
  }

  throw lastError || new Error('Failed to fetch data');
}

function parseGalleryImages(html: string): ImageItem[] {
  const images: ImageItem[] = [];
  const uniqueUrls = new Set<string>();

  // Extract from picture elements with specific gallery structure
  const pictureRegex = /<picture[^>]*>.*?<\/picture>/gs;
  const pictures = html.match(pictureRegex) || [];

  pictures.forEach(picture => {
    const sourceRegex = /<source[^>]+srcset="([^"]+)"[^>]*>/g;
    const matches = Array.from(picture.matchAll(sourceRegex));

    matches.forEach(match => {
      const srcset = match[1];
      if (srcset?.includes('zillowstatic.com')) {
        const urls = srcset.split(',')
          .map(src => src.trim().split(' ')[0])
          .filter(url => url.includes('zillowstatic.com'))
          .map(url => url.replace(/^\/\//, 'https://'));

        urls.forEach(url => {
          const baseUrl = url
            .replace(/\?.*$/, '')
            .replace(/(_[a-z]+)?\.(?:jpg|webp)/, '');
          
          const imageUrl = `${baseUrl}_f.webp`;
          
          if (!uniqueUrls.has(imageUrl)) {
            uniqueUrls.add(imageUrl);
            images.push({
              id: String(images.length + 1),
              url: imageUrl,
              thumbnail: `${baseUrl}_a.webp`,
              title: `Görsel ${images.length + 1}`
            });
          }
        });
      }
    });
  });

  return images;
}