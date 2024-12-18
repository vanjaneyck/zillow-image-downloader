import { ImageMetadata } from '../types/image';

export async function analyzeImage(url: string): Promise<ImageMetadata> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        status: 'success'
      });
    };

    img.onerror = () => {
      resolve({
        url,
        status: 'error',
        error: 'Görsel yüklenemedi'
      });
    };

    img.src = url;
  });
}

export async function fetchImageSize(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.headers.get('content-length') || undefined;
  } catch (error) {
    console.warn('Failed to fetch image size:', error);
    return undefined;
  }
}