import { ImageItem } from './types';
import { ZillowError } from './errors';
import { extractZpid } from './utils/urlParser';

const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

export async function fetchZillowImages(url: string): Promise<ImageItem[]> {
  try {
    // Extract ZPID from URL
    const zpid = extractZpid(url);
    if (!zpid) {
      throw new ZillowError('INVALID_URL', 'Geçerli bir Zillow URL\'si değil');
    }

    // Try to fetch the page first to get total image count
    const html = await fetchWithProxy(url);
    const totalImages = extractTotalImages(html);

    if (totalImages === 0) {
      throw new ZillowError('NO_IMAGES', 'Bu emlak ilanında görsel bulunamadı');
    }

    // Generate image URLs
    const images: ImageItem[] = [];
    for (let i = 0; i < totalImages; i++) {
      const imageUrl = `https://photos.zillowstatic.com/fp/${zpid}-${i}_f.jpg`;
      const thumbnailUrl = `https://photos.zillowstatic.com/fp/${zpid}-${i}_a.jpg`;
      
      // Verify image exists
      const exists = await verifyImageExists(thumbnailUrl);
      if (exists) {
        images.push({
          id: `${zpid}-${i}`,
          url: imageUrl,
          thumbnail: thumbnailUrl,
          title: `Görsel ${i + 1}`
        });
      }
    }

    return images;
  } catch (error) {
    console.error('Gallery fetch error:', error);
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

function extractTotalImages(html: string): number {
  const patterns = [
    /mmlb=g,(\d+)/g,
    /"totalPhotos"\s*:\s*(\d+)/,
    /"photoCount"\s*:\s*(\d+)/,
    /data-photo-count="(\d+)"/
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

async function verifyImageExists(url: string): Promise<boolean> {
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    return true;
  } catch {
    return false;
  }
}