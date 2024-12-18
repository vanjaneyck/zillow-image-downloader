import { useState, useCallback } from 'react';
import { ImageItem } from '../services/zillow/types';
import { extractImages } from '../services/zillow/extractor';
import { filterZillowImages } from '../services/zillow/imageFilter';
import { ZillowError } from '../services/zillow/errors';

export function useZillowImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async (url: string) => {
    if (!url.trim()) {
      setImages([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Tüm görselleri çek
      const allImages = await extractImages(url);
      
      // Görselleri filtrele
      const filteredImages = await filterZillowImages(allImages);

      if (filteredImages.length === 0) {
        throw new ZillowError('NO_IMAGES', 'Geçerli görsel bulunamadı');
      }

      setImages(filteredImages);
    } catch (err) {
      if (err instanceof ZillowError) {
        setError(err.message);
      } else {
        setError('Görsel yüklenirken bir hata oluştu');
      }
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, loading, error, fetchImages };
}