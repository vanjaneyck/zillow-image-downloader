import { ZillowError } from '../errors';

interface GalleryInfo {
  zpid: string;
  totalImages: number;
}

export async function findGalleryInfo(url: string): Promise<GalleryInfo> {
  try {
    // Extract ZPID from URL
    const zpidMatch = url.match(/\/(\d+)_zpid/);
    if (!zpidMatch) {
      throw new ZillowError('INVALID_URL', 'Geçerli bir Zillow URL\'si değil');
    }
    const zpid = zpidMatch[1];

    // Fetch the page content
    const response = await fetch(url);
    const html = await response.text();

    // Find total images using gallery pattern
    const galleryPattern = /mmlb=g,(\d+)/g;
    const matches = Array.from(html.matchAll(galleryPattern));
    const maxIndex = matches.length > 0 
      ? Math.max(...matches.map(m => parseInt(m[1], 10)))
      : -1;

    if (maxIndex < 0) {
      throw new ZillowError('NO_GALLERY', 'Galeri bulunamadı');
    }

    return {
      zpid,
      totalImages: maxIndex + 1 // Convert from 0-based index
    };
  } catch (error) {
    console.error('Gallery finder error:', error);
    if (error instanceof ZillowError) {
      throw error;
    }
    throw new ZillowError('FETCH_ERROR', 'Galeri bilgisi alınamadı');
  }
}