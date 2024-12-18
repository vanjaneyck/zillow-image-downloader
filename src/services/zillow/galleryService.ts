import { ImageItem } from '../../types/image';
import { ERROR_MESSAGES } from '../../config/constants';

interface ImageSource {
  url: string;
  width: number;
  format: 'jpg' | 'webp';
}

export async function fetchGalleryImages(url: string): Promise<ImageItem[]> {
  try {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch gallery');
    }

    const html = await response.text();
    const imageSources = extractImageSources(html);
    const uniqueImages = processImageSources(imageSources);

    if (uniqueImages.length === 0) {
      throw new Error('Bu emlak ilanında görsel bulunamadı');
    }

    return uniqueImages;
  } catch (error) {
    console.error('Gallery fetch error:', error);
    throw error instanceof Error ? error : new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
}

function extractImageSources(html: string): ImageSource[] {
  const sources: ImageSource[] = [];
  const pictureRegex = /<picture[^>]*>.*?<\/picture>/gs;
  const pictures = html.match(pictureRegex) || [];

  pictures.forEach(picture => {
    const srcsetRegex = /srcset="([^"]+)"/g;
    const matches = Array.from(picture.matchAll(srcsetRegex));

    matches.forEach(match => {
      const srcset = match[1];
      srcset.split(',').forEach(src => {
        const [url, size] = src.trim().split(' ');
        if (url?.includes('zillowstatic.com')) {
          const width = parseInt(size?.replace(/\D/g, '') || '0');
          const format = url.toLowerCase().endsWith('webp') ? 'webp' : 'jpg';
          sources.push({ url, width, format });
        }
      });
    });
  });

  return sources;
}

function processImageSources(sources: ImageSource[]): ImageItem[] {
  // Group images by their base identifier (removing quality suffixes and format)
  const imageGroups = new Map<string, ImageSource[]>();

  sources.forEach(source => {
    const baseId = source.url
      .replace(/^\/\//, '')
      .replace(/(_[a-z])?\.(?:jpg|webp).*$/, '')
      .replace(/\?.*$/, '');

    const group = imageGroups.get(baseId) || [];
    group.push(source);
    imageGroups.set(baseId, group);
  });

  // Select the best version from each group
  return Array.from(imageGroups.entries())
    .map(([_, group], index) => {
      // Sort by width to get the highest quality version
      const bestSource = group.sort((a, b) => b.width - a.width)[0];
      const baseUrl = bestSource.url
        .replace(/^\/\//, 'https://')
        .replace(/\?.*$/, '');

      return {
        id: String(index + 1),
        url: baseUrl.replace(/(_[a-z])?\.jpg/, '_f.jpg'),
        thumbnail: baseUrl.replace(/(_[a-z])?\.jpg/, '_a.jpg'),
        title: `Görsel ${index + 1}`,
        resolution: {
          width: bestSource.width,
          height: Math.round(bestSource.width * 0.75) // Approximate height based on typical aspect ratio
        }
      };
    });
}