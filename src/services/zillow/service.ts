import { ImageItem } from './types';
import { fetchWithProxy, checkImageExists } from './core/fetcher';
import { parseGalleryHtml, extractGallerySize } from './core/parser';
import { extractZpid, isValidZillowUrl, createImageUrl } from './utils/urlParser';
import { ZILLOW_CONFIG } from './config';

export async function getZillowImages(url: string): Promise<ImageItem[]> {
  if (!isValidZillowUrl(url)) {
    throw new Error('Lütfen geçerli bir Zillow emlak ilanı URL\'si girin');
  }

  const zpid = extractZpid(url);
  if (!zpid) {
    throw new Error('ZPID bulunamadı');
  }

  try {
    // Try both methods in parallel for faster results
    const [htmlImages, directImages] = await Promise.all([
      getImagesFromHtml(url, zpid),
      getImagesFromDirect(zpid)
    ]);

    const allImages = [...htmlImages, ...directImages];
    const uniqueImages = removeDuplicates(allImages);

    if (uniqueImages.length === 0) {
      throw new Error('Bu emlak ilanında görsel bulunamadı');
    }

    return uniqueImages;
  } catch (error) {
    console.error('Zillow image fetch error:', error);
    throw error;
  }
}

async function getImagesFromHtml(url: string, zpid: string): Promise<ImageItem[]> {
  try {
    const html = await fetchWithProxy(url);
    return parseGalleryHtml(html, zpid);
  } catch (error) {
    console.warn('HTML parsing failed:', error);
    return [];
  }
}

async function getImagesFromDirect(zpid: string): Promise<ImageItem[]> {
  const images: ImageItem[] = [];
  let consecutiveErrors = 0;

  for (let i = 0; consecutiveErrors < ZILLOW_CONFIG.MAX_RETRIES; i++) {
    try {
      for (const format of ZILLOW_CONFIG.IMAGE_FORMATS) {
        const thumbnailUrl = createImageUrl(zpid, i, format, 'a');
        const exists = await checkImageExists(thumbnailUrl);
        
        if (exists) {
          images.push({
            id: `${zpid}-${i}`,
            url: createImageUrl(zpid, i, format, 'f'),
            thumbnail: thumbnailUrl,
            title: `Görsel ${i + 1}`
          });
          consecutiveErrors = 0;
          break;
        }
      }
      consecutiveErrors++;
    } catch {
      consecutiveErrors++;
    }

    await new Promise(resolve => setTimeout(resolve, ZILLOW_CONFIG.RETRY_DELAY));
  }

  return images;
}

function removeDuplicates(images: ImageItem[]): ImageItem[] {
  const uniqueUrls = new Map<string, ImageItem>();
  images.forEach(image => {
    if (!uniqueUrls.has(image.url)) {
      uniqueUrls.set(image.url, image);
    }
  });
  return Array.from(uniqueUrls.values());
}