import { useState, useCallback } from 'react';
import { AnalyzedImage } from '../types/image';
import { analyzeImage, fetchImageSize } from '../services/imageAnalyzer';

export function useImageAnalysis() {
  const [images, setImages] = useState<AnalyzedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = useCallback(async (url: string) => {
    if (!url.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setImages([]);

      // Initialize with loading state
      const initialImage: AnalyzedImage = {
        url,
        thumbnail: url,
        status: 'loading'
      };
      setImages([initialImage]);

      const analyzed = await analyzeImage(url);
      if (analyzed.status === 'success' && analyzed.width && analyzed.height) {
        const size = await fetchImageSize(url);
        setImages([{
          ...analyzed,
          size: size ? parseInt(size) : undefined,
          thumbnail: url
        }]);
      } else {
        setError('Görsel analiz edilemedi');
        setImages([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analiz başarısız oldu');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    images,
    loading,
    error,
    analyzeUrl
  };
}