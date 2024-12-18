import { ImageItem } from '../../types/image';
import { ERROR_MESSAGES } from '../../config/constants';
import { parseZillowHtml } from './parser';

const HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

export async function fetchZillowImages(url: string): Promise<ImageItem[]> {
  if (!url.includes('zillow.com/homedetails')) {
    throw new Error('Lütfen geçerli bir Zillow emlak ilanı URL\'si girin');
  }

  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/',
    'https://proxy.cors.sh/'
  ];

  let lastError: Error | null = null;

  for (const proxy of proxies) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
        headers: HEADERS,
        mode: 'cors'
      });

      if (!response.ok) continue;

      const html = await response.text();
      const images = parseZillowHtml(html);

      if (images.length > 0) {
        return images;
      }
    } catch (error) {
      console.warn(`Failed with proxy ${proxy}:`, error);
      lastError = error instanceof Error ? error : new Error('Network error');
      continue;
    }
  }

  throw lastError || new Error('Görsel yüklenirken bir hata oluştu');
}