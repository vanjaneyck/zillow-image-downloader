import { ImageItem } from './types';
import { fetchWithProxy } from './core/fetcher';
import { parseZillowHtml } from './core/parser';
import { isValidZillowUrl } from './utils/urlParser';

export async function getZillowImages(url: string): Promise<ImageItem[]> {
  if (!isValidZillowUrl(url)) {
    throw new Error('Lütfen geçerli bir Zillow emlak ilanı URL\'si girin');
  }

  try {
    const html = await fetchWithProxy(url);
    const images = parseZillowHtml(html, url); // Pass URL to parser

    if (images.length === 0) {
      throw new Error('Bu emlak ilanında görsel bulunamadı');
    }

    return images;
  } catch (error) {
    console.error('Zillow image fetch error:', error);
    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error('CORS hatası oluştu. Farklı bir proxy ile tekrar deneniyor...');
    }
    throw error instanceof Error ? error : new Error('Görsel yüklenirken bir hata oluştu');
  }
}