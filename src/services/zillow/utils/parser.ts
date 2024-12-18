import { ImageItem } from '../../../types/image';

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
          const baseUrl = url
            .replace(/\?.*$/, '')
            .replace(/(_[a-z]+)?\.(?:jpg|webp)/, '');
          
          const imageUrl = `${baseUrl}_f.webp`;
          
          if (!uniqueUrls.has(imageUrl)) {
            uniqueUrls.add(imageUrl);
            images.push({
              id: String(images.length + 1),
              url: imageUrl,
              thumbnail: `${baseUrl}_a.webp`,
              title: `Görsel ${images.length + 1}`
            });
          }
        });
      }
    });
  });

  return images;
}