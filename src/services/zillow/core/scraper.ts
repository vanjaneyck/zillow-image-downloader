import { ImageItem } from '../types';
import { ZillowError } from '../errors';
import { fetchWithRetry } from './network';
import { extractZpid, isValidZillowUrl } from '../utils/urlParser';
import { getHighQualityImageUrl, getThumbnailUrl } from '../utils/imageUrl';
import { ZILLOW_CONFIG } from '../config';

export async function scrapeZillowImages(url: string): Promise<ImageItem[]> {
  if (!isValidZillowUrl(url)) {
    throw new ZillowError('INVALID_URL', 'Geçerli bir Zillow URL\'si değil');
  }

  const zpid = extractZpid(url);
  if (!zpid) {
    throw new ZillowError('INVALID_URL', 'ZPID bulunamadı');
  }

  try {
    // Try multiple methods in parallel for faster results
    const [directImages, galleryImages] = await Promise.all([
      getDirectImages(zpid),
      getGalleryImages(url, zpid)
    ]);

    // Combine and deduplicate results
    const allImages = [...directImages, ...galleryImages];
    const uniqueImages = deduplicateImages(allImages);

    if (uniqueImages.length === 0) {
      throw new ZillowError('NO_IMAGES', 'Bu emlak ilanında görsel bulunamadı');
    }

    return uniqueImages;
  } catch (error) {
    console.error('Zillow scraping error:', error);
    throw error instanceof ZillowError ? error : new ZillowError('FETCH_ERROR', 'Görsel yüklenirken bir hata oluştu');
  }
}

async function getDirectImages(zpid: string): Promise<ImageItem[]> {
  const images: ImageItem[] = [];
  const maxAttempts = ZILLOW_CONFIG.MAX_IMAGE_ATTEMPTS;
  let consecutiveFails = 0;

  for (let i = 0; i < maxAttempts && consecutiveFails < 3; i++) {
    const baseUrl = `https://photos.zillowstatic.com/fp/${zpid}-${i}`;
    const imageUrl = `${baseUrl}_f.jpg`;
    const thumbnailUrl = `${baseUrl}_a.jpg`;

    try {
      const exists = await checkImageExists(thumbnailUrl);
      if (exists) {
        images.push({
          id: `${zpid}-${i}`,
          url: imageUrl,
          thumbnail: thumbnailUrl,
          title: `Görsel ${i + 1}`
        });
        consecutiveFails = 0;
      } else {
        consecutiveFails++;
      }
    } catch {
      consecutiveFails++;
    }

    await new Promise(resolve => setTimeout(resolve, ZILLOW_CONFIG.REQUEST_DELAY));
  }

  return images;
}

async function getGalleryImages(url: string, zpid: string): Promise<ImageItem[]> {
  const html = await fetchWithRetry(url);
  const gallerySize = extractGallerySize(html);
  const images: ImageItem[] = [];

  if (gallerySize > 0) {
    for (let i = 0; i < gallerySize; i++) {
      const imageUrl = `https://photos.zillowstatic.com/fp/${zpid}_${i}_f.jpg`;
      const thumbnailUrl = `https://photos.zillowstatic.com/fp/${zpid}_${i}_a.jpg`;

      try {
        const exists = await checkImageExists(thumbnailUrl);
        if (exists) {
          images.push({
            id: `${zpid}-gallery-${i}`,
            url: imageUrl,
            thumbnail: thumbnailUrl,
            title: `Görsel ${i + 1}`
          });
        }
      } catch (error) {
        console.warn(`Failed to verify gallery image ${i}:`, error);
      }
    }
  }

  return images;
}

function extractGallerySize(html: string): number {
  const patterns = [
    /mmlb=g,(\d+)/g,
    /"totalPhotos"\s*:\s*(\d+)/,
    /"photoCount"\s*:\s*(\d+)/
  ];

  for (const pattern of patterns) {
    const matches = Array.from(html.matchAll(pattern));
    if (matches.length > 0) {
      const max = Math.max(...matches.map(m => parseInt(m[1], 10)));
      if (max > 0) return max + 1;
    }
  }

  return 0;
}

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ZILLOW_CONFIG.IMAGE_CHECK_TIMEOUT);

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

function deduplicateImages(images: ImageItem[]): ImageItem[] {
  const uniqueUrls = new Map<string, ImageItem>();
  
  images.forEach(image => {
    if (!uniqueUrls.has(image.url)) {
      uniqueUrls.set(image.url, image);
    }
  });

  return Array.from(uniqueUrls.values());
}