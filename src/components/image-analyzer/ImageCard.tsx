import React from 'react';
import { AnalyzedImage } from '../../services/image/types';

interface ImageCardProps {
  image: AnalyzedImage;
}

export function ImageCard({ image }: ImageCardProps) {
  if (image.status === 'error') {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex gap-4">
      <div className="w-48 h-48 flex-shrink-0">
        <img
          src={image.thumbnail}
          alt=""
          className="w-full h-full object-contain bg-white rounded border border-gray-200"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="space-y-2">
          <div className="font-medium text-gray-900">
            URL: <span className="font-normal text-gray-600 break-all">{image.url}</span>
          </div>
          
          {image.width && image.height && (
            <div className="font-medium text-gray-900">
              Çözünürlük: <span className="font-normal text-gray-600">
                {image.width} x {image.height} px
              </span>
            </div>
          )}
          
          {image.fileSize && (
            <div className="font-medium text-gray-900">
              Dosya Boyutu: <span className="font-normal text-gray-600">
                {image.fileSize}
              </span>
            </div>
          )}
          
          {image.aspectRatio && (
            <div className="font-medium text-gray-900">
              En/Boy Oranı: <span className="font-normal text-gray-600">
                {image.aspectRatio.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}