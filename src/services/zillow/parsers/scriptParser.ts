import { ParsedImage } from '../types';

export function parseScriptTags(html: string): ParsedImage[] {
  const images: ParsedImage[] = [];
  
  try {
    // Look for image data in script tags
    const scriptPattern = /<script[^>]*>\s*window\['__INITIAL_STATE__'\]\s*=\s*({[^<]+})/;
    const match = html.match(scriptPattern);
    
    if (match) {
      const data = JSON.parse(match[1]);
      
      // Navigate through common Zillow data structures
      const photoData = data?.propertyDetails?.photos ||
                       data?.property?.photos ||
                       data?.hdpData?.photos ||
                       [];
                       
      photoData.forEach((photo: any) => {
        if (photo?.url || photo?.mixedSources?.jpeg?.[0]?.url) {
          images.push({
            url: photo.url || photo.mixedSources.jpeg[0].url,
            caption: photo.caption
          });
        }
      });
    }
  } catch (error) {
    console.warn('Script parsing failed:', error);
  }
  
  return images;
}