import { ImageItem } from './types';

export function parseGalleryHtml(html: string): ImageItem[] {
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

        urls.forEach(url => {
          // Extract the base hash from the URL
          const hashMatch = url.match(/\/fp\/([a-f0-9]+)/);
          if (hashMatch) {
            const hash = hashMatch[1];
            const baseUrl = `https://photos.zillowstatic.com/fp/${hash}`;
            
            // Create high-res and thumbnail URLs
            const imageUrl = `${baseUrl}-uncropped_scaled_within_1536_1152.webp`;
            const thumbnailUrl = `${baseUrl}-cc_ft_384.webp`;

            if (!uniqueUrls.has(imageUrl)) {
              uniqueUrls.add(imageUrl);
              images.push({
                id: hash,
                url: imageUrl,
                thumbnail: thumbnailUrl,
                title: `Görsel ${images.length + 1}`
              });
            }
          }
        });
      }
    });
  });

  // If no images found in picture elements, try data attributes
  if (images.length === 0) {
    const dataImageRegex = /data-image-url="([^"]+)"/g;
    const dataMatches = Array.from(html.matchAll(dataImageRegex));
    
    dataMatches.forEach(match => {
      const url = match[1];
      if (url?.includes('zillowstatic.com')) {
        const hashMatch = url.match(/\/fp\/([a-f0-9]+)/);
        if (hashMatch) {
          const hash = hashMatch[1];
          const baseUrl = `https://photos.zillowstatic.com/fp/${hash}`;
          const imageUrl = `${baseUrl}-uncropped_scaled_within_1536_1152.webp`;
          const thumbnailUrl = `${baseUrl}-cc_ft_384.webp`;

          if (!uniqueUrls.has(imageUrl)) {
            uniqueUrls.add(imageUrl);
            images.push({
              id: hash,
              url: imageUrl,
              thumbnail: thumbnailUrl,
              title: `Görsel ${images.length + 1}`
            });
          }
        }
      }
    });
  }

  return images;
}