import React from 'react';
import { ImageItem } from '../types/image';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
  images: ImageItem[];
}

export function ImageGrid({ images }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Zillow emlak ilanı URL'sini girerek görselleri görüntüleyin
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}