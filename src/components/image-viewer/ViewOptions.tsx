import React from 'react';
import { Grid, List, SortAsc } from 'lucide-react';

interface ViewOptionsProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: 'default' | 'name';
  onSortByChange: (sort: 'default' | 'name') => void;
  totalImages: number;
  selectedCount: number;
  onSelectAll: () => void;
}

export function ViewOptions({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  totalImages,
  selectedCount,
  onSelectAll,
}: ViewOptionsProps) {
  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {totalImages} görsel bulundu
        </span>
        <button
          onClick={onSelectAll}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {selectedCount === totalImages ? 'Seçimi Kaldır' : 'Tümünü Seç'}
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as 'default' | 'name')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="default">Varsayılan Sıralama</option>
          <option value="name">İsme Göre Sırala</option>
        </select>
        
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            title="Grid Görünüm"
          >
            <Grid className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            title="Liste Görünüm"
          >
            <List className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}