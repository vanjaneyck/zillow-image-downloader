import React from 'react';
import { ImageItem } from '../types/image';

interface ImageCardProps {
  image: ImageItem;
  onClick?: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <div
      className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer"
      onClick={onClick}
    >
      <img
        src={image.thumbnail}
        alt={image.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {image.width && image.height && (
            <div className="text-white text-sm text-center bg-black/40 py-1 px-2 rounded">
              {image.width} x {image.height} px
            </div>
          )}
          <button className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Önizle
          </button>
        </div>
      </div>
    </div>
  );
}