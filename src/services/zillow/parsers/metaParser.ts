import { ParsedImage } from '../types';

export function parseMetaTags(html: string): ParsedImage[] {
  const images: ParsedImage[] = [];
  const metaPattern = /<meta[^>]+property="(?:og:image|image)"[^>]+content="([^"]+)"/g;
  
  const matches = html.matchAll(metaPattern);
  for (const match of matches) {
    if (match[1]?.includes('zillow')) {
      images.push({ url: match[1] });
    }
  }

  return images;
}