import { useState, useEffect, useCallback } from 'react';
import { ImageItem } from '../types/image';
import { searchImages } from '../services/imageService';
import { ERROR_MESSAGES } from '../config/constants';

export function useImageSearch(query: string) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!query.trim()) {
      setImages([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchImages(query);
      setImages(results);
    } catch (err) {
      setImages([]);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK.FAILED);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchImages, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchImages]);

  return { images, loading, error };
}