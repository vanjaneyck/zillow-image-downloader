import { ImageItem, ImageSource } from '../types';
import { createImageUrl } from '../utils/urlParser';

export function parseGalleryHtml(html: string, zpid: string): ImageItem[] {
  const images: ImageItem[] = [];
  const uniqueUrls = new Set<string>();

  // Extract from picture elements
  const pictureRegex = /<picture[^>]*>.*?<\/picture>/gs;
  const pictures = html.match(pictureRegex) || [];

  pictures.forEach(picture => {
    const sourceRegex = /<source[^>]+srcset="([^"]+)"[^>]*>/g;
    const matches = Array.from(picture.matchAll(sourceRegex));

    matches.forEach(match => {
      const srcset = match[1];
      if (srcset?.includes('zillowstatic.com')) {
        const urls = srcset.split(',')
          .map(src => src.trim().split(' ')[0])
          .filter(url => url.includes('zillowstatic.com'))
          .map(url => url.replace(/^\/\//, 'https://'));

        urls.forEach((url, index) => {
          const imageUrl = createImageUrl(zpid, index, 'webp', 'f');
          
          if (!uniqueUrls.has(imageUrl)) {
            uniqueUrls.add(imageUrl);
            images.push({
              id: `${zpid}-${index}`,
              url: imageUrl,
              thumbnail: createImageUrl(zpid, index, 'webp', 'a'),
              title: `Görsel ${images.length + 1}`
            });
          }
        });
      }
    });
  });

  return images;
}

export function extractGallerySize(html: string): number {
  const patterns = [
    /mmlb=g,(\d+)/g,
    /"totalPhotos"\s*:\s*(\d+)/,
    /"photoCount"\s*:\s*(\d+)/,
    /data-photo-count="(\d+)"/
  ];

  for (const pattern of patterns) {
    const matches = Array.from(html.matchAll(pattern));
    if (matches.length > 0) {
      const max = Math.max(...matches.map(m => parseInt(m[1], 10)));
      if (max > 0) return max + 1;
    }
  }

  return 0;
}