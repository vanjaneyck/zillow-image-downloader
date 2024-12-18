import React from 'react';
import { ImageItem } from '../services/zillow/types';

interface ImageListProps {
  images: ImageItem[];
}

export function ImageList({ images }: ImageListProps) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Henüz görsel analiz edilmedi
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group"
        >
          <img
            src={image.thumbnail}
            alt={image.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Görseli Aç
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}