import { ImageItem } from './types';
import { ZillowError } from './errors';

interface ImageSource {
  url: string;
  width?: number;
  format: 'webp' | 'jpg';
}

export function parseGalleryHtml(html: string): ImageItem[] {
  const images: ImageItem[] = [];
  const uniqueUrls = new Set<string>();

  // Find all picture elements
  const pictureRegex = /<picture[^>]*>.*?<\/picture>/gs;
  const pictures = html.match(pictureRegex) || [];

  pictures.forEach(picture => {
    // Extract srcset from source elements
    const sourceRegex = /<source[^>]+type="image\/(webp|jpeg)"[^>]+srcset="([^"]+)"[^>]*>/g;
    const matches = Array.from(picture.matchAll(sourceRegex));

    matches.forEach(match => {
      const format = match[1];
      const srcset = match[2];

      // Parse srcset to get URLs and widths
      const sources: ImageSource[] = srcset.split(',').map(src => {
        const [url, width] = src.trim().split(' ');
        return {
          url: url.replace(/^\/\//, 'https://'),
          width: width ? parseInt(width.replace(/\D/g, '')) : undefined,
          format: format === 'webp' ? 'webp' : 'jpg'
        };
      });

      // Get highest quality version
      const bestSource = sources
        .filter(s => s.url.includes('zillowstatic.com'))
        .sort((a, b) => (b.width || 0) - (a.width || 0))[0];

      if (bestSource) {
        const baseUrl = bestSource.url
          .replace(/\?.*$/, '') // Remove query params
          .replace(/(_[a-z]+)?\.(?:webp|jpg)/, ''); // Remove size suffix and extension

        // Generate high-res URL
        const imageUrl = `${baseUrl}_f.${bestSource.format}`;
        
        if (!uniqueUrls.has(imageUrl)) {
          uniqueUrls.add(imageUrl);
          images.push({
            id: String(images.length + 1),
            url: imageUrl,
            thumbnail: `${baseUrl}_a.${bestSource.format}`,
            title: `Görsel ${images.length + 1}`
          });
        }
      }
    });
  });

  return images;
}