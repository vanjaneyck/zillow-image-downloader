import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ImageItem } from '../services/zillow/types';

interface ImagePreviewProps {
  image: ImageItem;
  onClose: () => void;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export function ImagePreview({ image, onClose }: ImagePreviewProps) {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setLoading(false);
    };
    img.src = image.url;
  }, [image.url]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="max-w-5xl w-full bg-white rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain"
          />
          {dimensions && (
            <div className="absolute bottom-4 left-4 bg-black/75 text-white px-3 py-1 rounded text-sm">
              {dimensions.width} x {dimensions.height} px
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}