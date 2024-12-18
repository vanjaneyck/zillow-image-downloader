import { ParsedImage } from '../types';

export function parseDataAttributes(html: string): ParsedImage[] {
  const images: ParsedImage[] = [];
  const patterns = [
    /data-image-url="([^"]+)"/g,
    /data-src="([^"]+)"/g,
    /data-full-url="([^"]+)"/g
  ];

  patterns.forEach(pattern => {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      if (match[1]?.includes('zillow')) {
        images.push({ url: match[1] });
      }
    }
  });

  return images;
}