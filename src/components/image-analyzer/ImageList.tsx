import React from 'react';
import { AnalyzedImage } from '../../services/image/types';
import { ImageCard } from './ImageCard';

interface ImageListProps {
  images: AnalyzedImage[];
}

export function ImageList({ images }: ImageListProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Henüz görsel analiz edilmedi
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {images.map((image, index) => (
        <ImageCard key={index} image={image} />
      ))}
    </div>
  );
}