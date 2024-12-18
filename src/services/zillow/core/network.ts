import { PROXY_URLS, HEADERS } from '../config';

export async function fetchWithRetry(
  url: string, 
  options: { timeout?: number; retries?: number; retryDelay?: number } = {}
): Promise<string> {
  const { 
    timeout = 30000,
    retries = 3,
    retryDelay = 1000
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const proxy of PROXY_URLS) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: HEADERS,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const html = await response.text();
        if (html.includes('zillow.com')) {
          return html;
        }
      } catch (error) {
        console.warn(`Attempt ${attempt + 1}, proxy ${proxy} failed:`, error);
        lastError = error instanceof Error ? error : new Error('Network error');
        continue;
      }
    }

    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError || new Error('Failed to fetch data');
}