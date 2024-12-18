import { ParsedImage } from '../types';

export function parseJsonData(html: string): ParsedImage[] {
  const patterns = [
    /INITIAL_PHOTO_DATA\s*=\s*({[^<]+})/,
    /{"data":\s*({[^}]+})/,
    /"photos":\s*(\[[^\]]+\])/
  ];

  for (const pattern of patterns) {
    try {
      const match = html.match(pattern);
      if (!match) continue;

      const data = JSON.parse(match[1]);
      const photos = Array.isArray(data) ? data : data.photos || data.data?.photos;

      if (Array.isArray(photos)) {
        return photos
          .filter((photo: any) => photo?.url)
          .map((photo: any) => ({
            url: photo.url,
            caption: photo.caption
          }));
      }
    } catch (e) {
      console.warn('JSON parsing failed:', e);
    }
  }

  return [];
}