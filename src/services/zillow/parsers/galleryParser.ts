import { ParsedImage } from '../types';
import { extractZpid } from '../utils/urlParser';

export function parseGalleryData(html: string, url: string): ParsedImage[] {
  const images: ParsedImage[] = [];
  
  try {
    // Extract ZPID from URL
    const zpid = extractZpid(url);
    if (!zpid) return images;

    // Find gallery size from HTML
    const galleryPattern = /mmlb=g,(\d+)/g;
    const matches = Array.from(html.matchAll(galleryPattern));
    const maxIndex = Math.max(...matches.map(m => parseInt(m[1], 10)), -1);

    if (maxIndex >= 0) {
      // Generate gallery URLs using ZPID
      const baseUrl = `https://www.zillow.com/homedetails/${zpid}_zpid`;
      for (let i = 0; i <= maxIndex; i++) {
        images.push({
          url: `${baseUrl}/?mmlb=g,${i}`,
          caption: `Gallery Image ${i + 1}`
        });
      }
    }
  } catch (error) {
    console.warn('Gallery parsing failed:', error);
  }

  return images;
}