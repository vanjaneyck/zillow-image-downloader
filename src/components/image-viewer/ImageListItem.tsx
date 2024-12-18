import React from 'react';
import { Check, ExternalLink, Eye } from 'lucide-react';
import { ImageItem } from '../../types/image';

interface ImageListItemProps {
  image: ImageItem;
  isSelected: boolean;
  onSelect: (image: ImageItem) => void;
  onPreview: (image: ImageItem) => void;
}

export function ImageListItem({ 
  image, 
  isSelected, 
  onSelect,
  onPreview 
}: ImageListItemProps) {
  return (
    <div className={`
      flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50
      ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''}
    `}>
      <button
        onClick={() => onSelect(image)}
        className={`
          w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
        `}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </button>
      
      <div 
        className="w-16 h-16 flex-shrink-0 cursor-pointer"
        onClick={() => onPreview(image)}
      >
        <img
          src={image.thumbnail}
          alt={image.title}
          className="w-full h-full object-cover rounded"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
        <p className="text-sm text-gray-500 truncate">{image.url}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPreview(image)}
          className="p-2 text-gray-400 hover:text-gray-600"
          title="Önizle"
        >
          <Eye className="w-5 h-5" />
        </button>
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-gray-600"
          title="Görseli Yeni Sekmede Aç"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}