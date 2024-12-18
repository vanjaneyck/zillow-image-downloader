import React from 'react';
import { Check, Eye } from 'lucide-react';
import { ImageItem } from '../../types/image';

interface ImageCardProps {
  image: ImageItem;
  isSelected: boolean;
  onSelect: (image: ImageItem) => void;
  onPreview: (image: ImageItem) => void;
}

export function ImageCard({ image, isSelected, onSelect, onPreview }: ImageCardProps) {
  return (
    <div 
      className={`
        aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      <img
        src={image.thumbnail}
        alt={image.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        loading="lazy"
        onClick={() => onPreview(image)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(image);
            }}
            className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-white bg-black/20'}
            `}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(image);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Önizle
          </button>
        </div>
      </div>
    </div>
  );
}