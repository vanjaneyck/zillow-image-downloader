import { ImageItem } from '../../../types/image';
import { getHighResImageUrl, getThumbnailUrl } from '../../../utils/url';

export function extractFromHtml(html: string): ImageItem[] {
  const images = new Set<string>();
  
  // Extract from picture elements
  const pictureMatches = html.matchAll(/<picture[^>]*>.*?<\/picture>/gs);
  
  for (const pictureMatch of pictureMatches) {
    const picture = pictureMatch[0];
    
    // Extract srcset URLs
    const sourceMatches = picture.matchAll(/<source[^>]+srcset="([^"]+)"[^>]*>/g);
    for (const sourceMatch of sourceMatches) {
      const srcset = sourceMatch[1];
      const urls = srcset
        .split(',')
        .map(src => src.trim().split(' ')[0])
        .filter(url => url.includes('zillowstatic.com'));
      
      urls.forEach(url => images.add(url));
    }
    
    // Extract img src as fallback
    const imgMatch = picture.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    if (imgMatch?.[1]?.includes('zillowstatic.com')) {
      images.add(imgMatch[1]);
    }
  }
  
  return Array.from(images)
    .map((url, index) => ({
      id: String(index + 1),
      url: getHighResImageUrl(url),
      thumbnail: getThumbnailUrl(url),
      title: `Görsel ${index + 1}`
    }));
}