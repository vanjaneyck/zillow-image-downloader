import { ImageItem } from '../../types/image';
import { ERROR_MESSAGES } from '../../config/api';
import { normalizeUrl, getHighResImageUrl, getThumbnailUrl } from '../../utils/url';

export function parseZillowHtml(html: string): ImageItem[] {
  try {
    // First try to extract from JSON data
    const jsonData = extractJsonData(html);
    if (jsonData.length > 0) {
      return jsonData;
    }

    // Fallback to HTML parsing if JSON extraction fails
    const htmlImages = extractImagesFromHtml(html);
    if (htmlImages.length > 0) {
      return htmlImages;
    }

    throw new Error(ERROR_MESSAGES.NO_IMAGES);
  } catch (error) {
    console.error('HTML parsing error:', error);
    throw new Error(ERROR_MESSAGES.PARSING_ERROR);
  }
}

function extractJsonData(html: string): ImageItem[] {
  try {
    // Look for Zillow's initial state data
    const matches = [
      /"fullScreenPhotos":\s*(\[[^\]]+\])/,
      /"photos":\s*(\[[^\]]+\])/,
      /{"data":\s*({[^}]+})/
    ];

    for (const regex of matches) {
      const match = html.match(regex);
      if (match) {
        const data = JSON.parse(match[1]);
        const photos = Array.isArray(data) ? data : data?.propertyDetails?.photos || [];
        
        return photos
          .filter((photo: any) => photo?.url || photo?.mixedSources?.jpeg)
          .map((photo: any, index: number) => {
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
      }
    }
  } catch (e) {
    console.warn('JSON data extraction failed:', e);
  }
  
  return [];
}

function extractImagesFromHtml(html: string): ImageItem[] {
  const images = new Set<string>();
  
  // Extract from picture elements
  const pictureRegex = /<picture[^>]*>.*?<\/picture>/gs;
  const pictures = html.match(pictureRegex) || [];
  
  pictures.forEach(picture => {
    // Get all source and img elements
    const sourceRegex = /<source[^>]+>/g;
    const imgRegex = /<img[^>]+>/;
    
    const sources = picture.match(sourceRegex) || [];
    const img = picture.match(imgRegex)?.[0];
    
    // Extract URLs from srcset
    sources.forEach(source => {
      const srcset = source.match(/srcset="([^"]+)"/)?.[1];
      if (srcset) {
        const urls = srcset.split(',')
          .map(src => src.trim().split(' ')[0])
          .filter(url => url.includes('zillowstatic.com'));
        
        urls.forEach(url => images.add(url));
      }
    });
    
    // Extract from img src as fallback
    if (img) {
      const src = img.match(/src="([^"]+)"/)?.[1];
      if (src?.includes('zillowstatic.com')) {
        images.add(src);
      }
    }
  });
  
  return Array.from(images)
    .map((url, index) => ({
      id: String(index + 1),
      url: getHighResImageUrl(url),
      thumbnail: getThumbnailUrl(url),
      title: `Görsel ${index + 1}`
    }));
}