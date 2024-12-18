import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { ImageItem } from '../../types/image';
import { downloadImages } from '../../utils/download';

interface ImagePreviewModalProps {
  images: ImageItem[];
  initialImage: ImageItem;
  onClose: () => void;
}

export function ImagePreviewModal({ images, initialImage, onClose }: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return images.findIndex(img => img.id === initialImage.id);
  });
  const [isZoomed, setIsZoomed] = useState(false);
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

  const handleDownload = () => {
    downloadImages([currentImage.url]);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 text-white flex justify-between items-center bg-black/50">
        <div className="text-lg font-medium">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="İndir"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title={isZoomed ? 'Küçült' : 'Büyüt'}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <button
          onClick={() => !isFirst && setCurrentIndex(prev => prev - 1)}
          disabled={isFirst}
          className={`absolute left-4 p-2 rounded-full bg-black/50 text-white z-10
            ${isFirst ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70'}`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          className={`relative max-h-full max-w-full transition-transform duration-300 ease-out
            ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
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
            onLoad={() => setLoading(false)}
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