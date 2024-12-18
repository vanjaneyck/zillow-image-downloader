import React from 'react';
import { ImageItem } from '../../types/image';
import { ImageCard } from './ImageCard';
import { ImageListItem } from './ImageListItem';

interface ImageGridProps {
  images: ImageItem[];
  selectedImages: Set<string>;
  onImageSelect: (image: ImageItem) => void;
  onImagePreview: (image: ImageItem) => void;
  viewMode: 'grid' | 'list';
}

export function ImageGrid({ 
  images, 
  selectedImages, 
  onImageSelect,
  onImagePreview,
  viewMode 
}: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Zillow emlak ilanı URL'sini girerek görselleri görüntüleyin
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {images.map((image) => (
          <ImageListItem
            key={image.id}
            image={image}
            isSelected={selectedImages.has(image.id)}
            onSelect={onImageSelect}
            onPreview={onImagePreview}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImages.has(image.id)}
          onSelect={onImageSelect}
          onPreview={onImagePreview}
        />
      ))}
    </div>
  );
}