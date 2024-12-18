import { ImageItem } from './types';
import { ZillowError } from './errors';

const HEADERS = {
  'Accept': 'image/*',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
};

export async function scrapeZillowImages(url: string): Promise<ImageItem[]> {
  try {
    // Extract ZPID
    const zpidMatch = url.match(/\/(\d+)_zpid/);
    if (!zpidMatch) {
      throw new ZillowError('INVALID_URL', 'Geçerli bir Zillow URL\'si değil');
    }
    const zpid = zpidMatch[1];

    const images: ImageItem[] = [];
    let consecutiveErrors = 0;
    let index = 0;

    while (consecutiveErrors < 3 && index < 50) { // Try up to 50 images
      try {
        // Try WebP format first, then fallback to JPG
        const formats = ['webp', 'jpg'];
        let imageFound = false;

        for (const format of formats) {
          const imageUrl = `https://photos.zillowstatic.com/fp/${zpid}_${index}.${format}`;
          const exists = await checkImageExists(imageUrl);
          
          if (exists) {
            images.push({
              id: `${zpid}-${index}`,
              url: imageUrl,
              thumbnail: imageUrl.replace(`.${format}`, `-t.${format}`),
              title: `Görsel ${index + 1}`
            });
            imageFound = true;
            consecutiveErrors = 0;
            break;
          }
        }

        if (!imageFound) {
          consecutiveErrors++;
        }

      } catch (error) {
        console.warn(`Error checking image ${index}:`, error);
        consecutiveErrors++;
      }

      index++;
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (images.length === 0) {
      throw new ZillowError('NO_IMAGES', 'Bu emlak ilanında görsel bulunamadı');
    }

    return images;
  } catch (error) {
    console.error('Zillow scraping error:', error);
    throw error instanceof ZillowError ? error : new ZillowError('FETCH_ERROR', 'Görsel yüklenirken bir hata oluştu');
  }
}

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: HEADERS,
      cache: 'no-store'
    });
    return response.ok;
  } catch {
    return false;
  }
}