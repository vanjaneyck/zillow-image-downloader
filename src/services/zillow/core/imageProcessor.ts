import { ImageSource, ImageItem } from '../types';

export function processImages(sources: ImageSource[]): ImageItem[] {
  const uniqueImages = filterUniqueImages(sources);
  
  return uniqueImages.map((url, index) => ({
    id: String(index + 1),
    url: getHighResUrl(url),
    thumbnail: getThumbnailUrl(url),
    title: `Görsel ${index + 1}`
  }));
}

function filterUniqueImages(sources: ImageSource[]): string[] {
  const imageGroups = new Map<string, ImageSource[]>();
  
  sources.forEach(source => {
    const baseId = source.url.replace(/(_[a-z])?\.(?:jpg|jpeg|webp).*$/, '');
    const group = imageGroups.get(baseId) || [];
    group.push(source);
    imageGroups.set(baseId, group);
  });

  return Array.from(imageGroups.values())
    .map(group => group.sort((a, b) => b.quality - a.quality)[0].url);
}

function getHighResUrl(url: string): string {
  return url
    .replace(/\?.*$/, '')
    .replace(/(_[a-z])?\.(?:jpg|jpeg|webp)/, '_f.jpg');
}

function getThumbnailUrl(url: string): string {
  return url
    .replace(/\?.*$/, '')
    .replace(/(_[a-z])?\.(?:jpg|jpeg|webp)/, '_a.jpg');
}