import { useState, useCallback } from 'react';
import { ImageItem } from '../services/zillow/types';
import { getGalleryImages } from '../services/zillow/gallery/service';

export function useZillowGallery() {
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
      const results = await getGalleryImages(url);
      setImages(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görsel yüklenirken bir hata oluştu');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, loading, error, fetchImages };
}