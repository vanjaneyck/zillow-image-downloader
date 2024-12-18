import { PROXY_URLS } from '../config';

export async function fetchWithProxy(url: string): Promise<string> {
  let lastError: Error | null = null;

  for (const proxy of PROXY_URLS) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) continue;
      
      const html = await response.text();
      if (html.includes('zillow.com')) {
        return html;
      }
    } catch (error) {
      console.warn(`Failed with proxy ${proxy}:`, error);
      lastError = error instanceof Error ? error : new Error('Network error');
      continue;
    }
  }

  throw lastError || new Error('Failed to fetch data');
}

export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Accept': 'image/webp,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}