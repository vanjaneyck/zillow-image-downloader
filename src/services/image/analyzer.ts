import { ImageMetadata, AnalyzedImage } from './types';

export async function analyzeImage(url: string): Promise<AnalyzedImage> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        url,
        thumbnail: url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        status: 'success'
      });
    };

    img.onerror = () => {
      resolve({
        url,
        thumbnail: '',
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
    const size = response.headers.get('content-length');
    if (size) {
      return formatFileSize(parseInt(size, 10));
    }
  } catch (error) {
    console.warn('Failed to fetch image size:', error);
  }
  return undefined;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}