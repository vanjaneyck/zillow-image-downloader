import { ImageItem } from './types';

interface ImageValidation {
  minWidth: number;
  minHeight: number;
  aspectRatio: number;
  tolerance: number;
}

const VALIDATION_RULES: ImageValidation = {
  minWidth: 800,
  minHeight: 600,
  aspectRatio: 1.33, // 4:3 oranı
  tolerance: 0.1
};

export async function filterZillowImages(images: ImageItem[]): Promise<ImageItem[]> {
  const validatedImages: ImageItem[] = [];
  
  for (const image of images) {
    const dimensions = await getImageDimensions(image.url);
    if (dimensions && isValidImage(dimensions)) {
      validatedImages.push({
        ...image,
        width: dimensions.width,
        height: dimensions.height
      });
    }
  }

  // İlk 8 görseli al (genellikle ana ilanın görselleri)
  return validatedImages.slice(0, 8);
}

async function getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function isValidImage(dimensions: { width: number; height: number }): boolean {
  // Minimum boyut kontrolü
  if (dimensions.width < VALIDATION_RULES.minWidth || 
      dimensions.height < VALIDATION_RULES.minHeight) {
    return false;
  }

  // En/boy oranı kontrolü
  const aspectRatio = dimensions.width / dimensions.height;
  const targetRatio = VALIDATION_RULES.aspectRatio;
  const tolerance = VALIDATION_RULES.tolerance;

  return Math.abs(aspectRatio - targetRatio) <= tolerance;
}