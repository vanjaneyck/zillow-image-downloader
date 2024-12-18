import { ZILLOW_CONFIG } from '../config';

export async function fetchWithProxy(url: string): Promise<string> {
  let lastError: Error | null = null;

  for (const proxy of ZILLOW_CONFIG.PROXY_URLS) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: ZILLOW_CONFIG.HEADERS,
        cache: 'no-store'
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
      headers: ZILLOW_CONFIG.HEADERS,
      cache: 'no-store'
    });
    return response.ok;
  } catch {
    return false;
  }
}