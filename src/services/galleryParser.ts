import { ImageItem } from '../types/image';

export function parseGalleryHtml(html: string): ImageItem[] {
  const images: ImageItem[] = [];
  const pictureRegex = /<picture[^>]*>.*?<\/picture>/gs;
  const srcsetRegex = /srcset="([^"]+)"/g;
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  
  // Extract from picture elements
  const pictureMatches = html.match(pictureRegex) || [];
  pictureMatches.forEach((pictureTag) => {
    const srcsetMatches = Array.from(pictureTag.matchAll(srcsetRegex));
    
    for (const srcsetMatch of srcsetMatches) {
      const srcset = srcsetMatch[1];
      const urls = srcset.split(',')
        .map(src => src.trim().split(' ')[0])
        .filter(url => url.includes('zillowstatic.com'));
      
      if (urls.length > 0) {
        // Get the highest quality URL
        const baseUrl = urls[urls.length - 1] // Use the last URL which is typically highest quality
          .replace(/^\/\//, 'https://')  // Ensure https protocol
          .replace(/\?.*$/, '')          // Remove query parameters
          .replace(/_[a-z]+\.jpg/, '_f.jpg'); // Get highest quality version
        
        // Create thumbnail URL
        const thumbnailUrl = baseUrl.replace(/_f\.jpg/, '_a.jpg');
        
        // Only add unique images
        if (!images.some(img => img.url === baseUrl)) {
          images.push({
            id: String(images.length + 1),
            url: baseUrl,
            thumbnail: thumbnailUrl,
            title: `Görsel ${images.length + 1}`
          });
        }
      }
    }
  });

  // Fallback to img elements if no pictures found
  if (images.length === 0) {
    const imgMatches = Array.from(html.matchAll(imgRegex));
    imgMatches.forEach((match) => {
      const url = match[1];
      if (url.includes('zillowstatic.com')) {
        const baseUrl = url
          .replace(/^\/\//, 'https://')
          .replace(/\?.*$/, '')
          .replace(/_[a-z]+\.jpg/, '_f.jpg');
        
        const thumbnailUrl = baseUrl.replace(/_f\.jpg/, '_a.jpg');
        
        if (!images.some(img => img.url === baseUrl)) {
          images.push({
            id: String(images.length + 1),
            url: baseUrl,
            thumbnail: thumbnailUrl,
            title: `Görsel ${images.length + 1}`
          });
        }
      }
    });
  }

  return images;
}