import React, { useState, useCallback } from 'react';
import { ImageItem } from '../types/image';
import { scrapeZillowImages } from '../services/zillow/scraper';
import { downloadImages } from '../utils/download';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Header } from './image-viewer/Header';
import { SearchForm } from './image-viewer/SearchForm';
import { ImageGrid } from './image-viewer/ImageGrid';
import { ErrorMessage } from './image-viewer/ErrorMessage';
import { SelectionToolbar } from './image-viewer/SelectionToolbar';
import { ViewOptions } from './image-viewer/ViewOptions';
import { ImagePreviewModal } from './image-viewer/ImagePreviewModal';

export function ImageViewer() {
  const [url, setUrl] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'name'>('default');
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSelectedImages(new Set());
      const results = await scrapeZillowImages(url.trim());
      setImages(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görsel yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = useCallback((image: ImageItem) => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(image.id)) {
        newSelection.delete(image.id);
      } else {
        newSelection.add(image.id);
      }
      return newSelection;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedImages(prev => {
      if (prev.size === images.length) {
        return new Set();
      }
      return new Set(images.map(img => img.id));
    });
  }, [images]);

  const handleDownloadSelected = useCallback(() => {
    const selectedUrls = images
      .filter(img => selectedImages.has(img.id))
      .map(img => img.url);
    
    if (selectedUrls.length > 0) {
      downloadImages(selectedUrls);
    }
  }, [images, selectedImages]);

  const sortedImages = [...images].sort((a, b) => {
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <Header />
            <SearchForm
              url={url}
              onUrlChange={setUrl}
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          </div>
          
          <div className="p-6">
            {error && <ErrorMessage message={error} />}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Görseller yükleniyor...</p>
              </div>
            ) : images.length > 0 ? (
              <>
                <ViewOptions
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  totalImages={images.length}
                  selectedCount={selectedImages.size}
                  onSelectAll={handleSelectAll}
                />
                <ImageGrid
                  images={sortedImages}
                  selectedImages={selectedImages}
                  onImageSelect={handleImageSelect}
                  onImagePreview={setPreviewImage}
                  viewMode={viewMode}
                />
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Zillow emlak ilanı URL'sini girerek görselleri görüntüleyin
              </div>
            )}
          </div>
        </div>
      </div>

      <SelectionToolbar
        selectedImages={selectedImages}
        onClearSelection={() => setSelectedImages(new Set())}
        onDownloadSelected={handleDownloadSelected}
      />

      {previewImage && (
        <ImagePreviewModal
          images={images}
          initialImage={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}