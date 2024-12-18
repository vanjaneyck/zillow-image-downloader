import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ImageItem } from '../services/zillow/types';

interface ImageGalleryProps {
  images: ImageItem[];
  initialIndex: number;
  onClose: () => void;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export function ImageGallery({ images, initialIndex, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [loading, setLoading] = useState(true);

  const currentImage = images[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (!isFirst) setCurrentIndex(prev => prev - 1);
          break;
        case 'ArrowRight':
          if (!isLast) setCurrentIndex(prev => prev + 1);
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, onClose]);

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setLoading(false);
    };
    img.src = currentImage.url;
  }, [currentImage.url]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 text-white flex justify-between items-center">
        <div className="text-lg">
          {currentIndex + 1} / {images.length}
        </div>
        {dimensions && (
          <div className="text-sm">
            {dimensions.width} x {dimensions.height} px
          </div>
        )}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative">
        <button
          onClick={() => !isFirst && setCurrentIndex(prev => prev - 1)}
          disabled={isFirst}
          className={`absolute left-4 p-2 rounded-full bg-black/50 text-white z-10
            ${isFirst ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70'}`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="relative max-h-full max-w-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className={`max-h-[calc(100vh-12rem)] max-w-full object-contain transition-opacity duration-300
              ${loading ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        <button
          onClick={() => !isLast && setCurrentIndex(prev => prev + 1)}
          disabled={isLast}
          className={`absolute right-4 p-2 rounded-full bg-black/50 text-white z-10
            ${isLast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70'}`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-black/50 p-4">
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all
                ${index === currentIndex 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : 'opacity-70 hover:opacity-100'}`}
            >
              <img
                src={image.thumbnail}
                alt={image.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}