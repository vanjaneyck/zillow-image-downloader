import React from 'react';
import { Download, X } from 'lucide-react';
import { ImageItem } from '../../types/image';

interface SelectionToolbarProps {
  selectedImages: Set<string>;
  onClearSelection: () => void;
  onDownloadSelected: () => void;
}

export function SelectionToolbar({ 
  selectedImages, 
  onClearSelection,
  onDownloadSelected 
}: SelectionToolbarProps) {
  if (selectedImages.size === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedImages.size} görsel seçildi
          </span>
          <button
            onClick={onClearSelection}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm"
          >
            <X className="w-4 h-4" />
            Seçimi Temizle
          </button>
        </div>
        <button
          onClick={onDownloadSelected}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Seçilenleri İndir
        </button>
      </div>
    </div>
  );
}