import { GalleryImage } from './types';

export function createImageUrls(zpid: string, index: number): GalleryImage {
  const baseId = generateImageId(zpid, index);
  
  return {
    id: `${zpid}-${index}`,
    url: createImageUrl(baseId, 'f'),
    thumbnail: createImageUrl(baseId, 'a'),
    fullSize: createImageUrl(baseId, 'f'),
    index
  };
}

function generateImageId(zpid: string, index: number): string {
  // Zillow uses a specific format for their image IDs
  return `${zpid}-${index}`;
}

function createImageUrl(baseId: string, size: 'f' | 'a'): string {
  // Zillow's image URL format
  return `https://photos.zillowstatic.com/fp/${baseId}_${size}.jpg`;
}