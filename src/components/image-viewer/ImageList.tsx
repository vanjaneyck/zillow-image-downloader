import React from 'react';
import { ImageItem } from '../../types/image';
import { ImageCard } from './ImageCard';

interface ImageListProps {
  images: ImageItem[];
  selectedId?: string;
  onSelect: (image: ImageItem) => void;
}

export function ImageList({ images, selectedId, onSelect }: ImageListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={image.id === selectedId}
          onSelect={() => onSelect(image)}
        />
      ))}
    </div>
  );
}