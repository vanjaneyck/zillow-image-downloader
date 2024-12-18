import { ImageItem } from '../../../types/image';
import { ZillowJsonData, ZillowImage } from '../types';
import { getHighResImageUrl, getThumbnailUrl } from '../../../utils/url';

const JSON_PATTERNS = [
  /"fullScreenPhotos":\s*(\[[^\]]+\])/,
  /"photos":\s*(\[[^\]]+\])/,
  /{"data":\s*({[^}]+})/
] as const;

export function extractFromJson(html: string): ImageItem[] {
  for (const pattern of JSON_PATTERNS) {
    try {
      const match = html.match(pattern);
      if (!match) continue;

      const data = JSON.parse(match[1]) as ZillowJsonData | ZillowImage[];
      const photos = Array.isArray(data) ? data : data?.propertyDetails?.photos || [];
      
      return photos
        .filter(photo => photo?.url || photo?.mixedSources?.jpeg)
        .map((photo, index) => {
          const baseUrl = photo.url || photo.mixedSources?.jpeg?.[0]?.url;
          if (!baseUrl) return null;
          
          return {
            id: String(index + 1),
            url: getHighResImageUrl(baseUrl),
            thumbnail: getThumbnailUrl(baseUrl),
            title: photo.caption || `Görsel ${index + 1}`
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.warn('JSON extraction failed:', error);
      continue;
    }
  }
  
  return [];
}