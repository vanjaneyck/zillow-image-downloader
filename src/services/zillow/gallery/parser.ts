import { GalleryMetadata } from './types';
import { extractZpid } from '../utils/urlParser';
import { ZillowError } from '../errors';

export function extractGalleryMetadata(html: string, url: string): GalleryMetadata {
  const zpid = extractZpid(url);
  if (!zpid) {
    throw new ZillowError('INVALID_URL', 'ZPID bulunamadı');
  }

  // Extract gallery size using multiple patterns
  const patterns = [
    /totalImages["\s:]+(\d+)/i,
    /mmlb=g,(\d+)/g,
    /photoCount["\s:]+(\d+)/i
  ];

  let totalImages = 0;
  
  for (const pattern of patterns) {
    const matches = Array.from(html.matchAll(pattern));
    const maxCount = Math.max(
      ...matches.map(m => parseInt(m[1], 10)),
      -1
    );
    
    if (maxCount > totalImages) {
      totalImages = maxCount + 1; // Convert from 0-based index
    }
  }

  // Extract current image index
  const currentIndex = extractCurrentIndex(url) || 0;

  return {
    zpid,
    totalImages,
    currentIndex
  };
}

function extractCurrentIndex(url: string): number {
  const match = url.match(/mmlb=g,(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}