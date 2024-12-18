import React from 'react';
import { Download } from 'lucide-react';
import { ImageItem } from '../../types/image';

interface ImageDetailsProps {
  image: ImageItem;
}

export function ImageDetails({ image }: ImageDetailsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:static md:shadow-none md:border-none md:bg-gray-50 md:rounded-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="font-medium truncate">{image.title}</h3>
          <p className="text-sm text-gray-500 truncate">{image.url}</p>
        </div>
        <a
          href={image.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          İndir
        </a>
      </div>
    </div>
  );
}