import { ParsedImage } from '../types';

export function parsePictureElements(html: string): ParsedImage[] {
  const images: ParsedImage[] = [];
  const picturePattern = /<picture[^>]*>.*?<\/picture>/gs;
  const srcsetPattern = /srcset="([^"]+)"/g;

  const pictures = html.match(picturePattern) || [];
  
  pictures.forEach(picture => {
    const srcsetMatches = Array.from(picture.matchAll(srcsetPattern));
    
    srcsetMatches.forEach(match => {
      const srcset = match[1];
      const urls = srcset.split(',')
        .map(src => src.trim().split(' ')[0])
        .filter(url => url.includes('zillow'));
      
      if (urls.length > 0) {
        // Get highest quality URL
        images.push({ url: urls[urls.length - 1] });
      }
    });
  });

  return images;
}