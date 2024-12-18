import { ImageItem } from '../types/image';
import { API_CONFIG, ERROR_MESSAGES } from '../config/api';
import { fetchWithRetry } from '../utils/networkUtils';
import { extractZpidFromUrl } from '../utils/zillowParser';

export async function scrapeZillowImages(url: string): Promise<ImageItem[]> {
  try {
    const zpid = extractZpidFromUrl(url);
    const apiUrl = `${API_CONFIG.CORS_PROXY}${encodeURIComponent(
      `${API_CONFIG.ZILLOW.BASE_URL}${zpid}_zpid/`
    )}`;

    const response = await fetchWithRetry(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': API_CONFIG.ZILLOW.USER_AGENT,
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: API_CONFIG.ZILLOW.TIMEOUT,
      retries: API_CONFIG.ZILLOW.RETRIES
    });

    const html = await response.text();
    
    // Extract initial state data
    const dataMatch = html.match(/window\['__INITIAL_STATE__'\]\s*=\s*({[^<]+})/);
    if (!dataMatch) {
      throw new Error(ERROR_MESSAGES.PARSING_ERROR);
    }

    // Parse the JSON data
    const data = JSON.parse(dataMatch[1]);
    const photos = data?.propertyDetails?.propertyData?.photos || [];

    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error(ERROR_MESSAGES.NO_IMAGES);
    }

    return photos
      .filter(photo => photo?.url && typeof photo.url === 'string')
      .map((photo, index) => ({
        id: String(index + 1),
        url: ensureValidImageUrl(photo.url),
        thumbnail: createThumbnailUrl(photo.url),
        title: photo.caption || `Görsel ${index + 1}`
      }));
  } catch (error) {
    console.error('Zillow scraping error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(ERROR_MESSAGES.API_ERROR);
  }
}

function ensureValidImageUrl(url: string): string {
  const fullUrl = url.startsWith('//') ? `https:${url}` : url;
  return fullUrl.replace(/\?.*$/, '').replace(/(_[a-z])?\.jpg/, '_f.jpg');
}

function createThumbnailUrl(url: string): string {
  const fullUrl = url.startsWith('//') ? `https:${url}` : url;
  return fullUrl.replace(/(_[a-z])?\.jpg/, '_a.jpg');
}