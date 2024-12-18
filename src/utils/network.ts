import { CORS_PROXIES, NETWORK, ERROR_MESSAGES } from '../config/constants';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchWithProxy(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = NETWORK.TIMEOUT, ...fetchOptions } = options;
  let lastError: Error;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(proxyUrl, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          ...fetchOptions.headers,
          'Origin': window.location.origin
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(ERROR_MESSAGES.NETWORK.FAILED);
      continue;
    }
  }

  throw lastError;
}