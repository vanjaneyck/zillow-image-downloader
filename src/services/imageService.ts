import { ImageItem } from '../types/image';
import { fetchWithProxy } from '../utils/network';
import { parseGalleryHtml } from './galleryParser';
import { ERROR_MESSAGES } from '../config/constants';

export async function searchImages(url: string): Promise<ImageItem[]> {
  if (!url.includes('zillow.com/homedetails')) {
    throw new Error('Lütfen geçerli bir Zillow emlak ilanı URL\'si girin');
  }

  try {
    const response = await fetchWithProxy(url);
    const html = await response.text();
    const images = parseGalleryHtml(html);

    if (images.length === 0) {
      throw new Error('Bu emlak ilanında görsel bulunamadı');
    }

    return images;
  } catch (error) {
    console.error('Image search error:', error);
    throw error instanceof Error ? error : new Error(ERROR_MESSAGES.NETWORK.FAILED);
  }
}