import React, { useState } from 'react';
import { useZillowGallery } from '../../hooks/useZillowGallery';
import { ImageList } from './ImageList';
import { Header } from './Header';
import { SearchInput } from '../ui/SearchInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ImageDetails } from './ImageDetails';
import { GalleryView } from './GalleryView';

export function ImageViewer() {
  const [url, setUrl] = useState('');
  const { images, loading, error, fetchImages } = useZillowGallery();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  const handleSearch = (newUrl: string) => {
    setUrl(newUrl);
    if (newUrl.trim()) {
      fetchImages(newUrl);
      setSelectedImage(null);
      setShowGallery(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-100">
        <Header />
        <div className="mt-6">
          <SearchInput
            value={url}
            onChange={handleSearch}
            placeholder="Zillow emlak ilanı URL'sini girin..."
            helperText="Örnek: https://www.zillow.com/homedetails/123-address/12345_zpid/"
          />
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 text-red-600 bg-red-50 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-gray-500">Görseller yükleniyor...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Bulunan Görseller ({images.length})
              </h2>
            </div>
            <ImageList
              images={images}
              selectedId={selectedImage?.id}
              onSelect={(image) => {
                setSelectedImage(image);
                setShowGallery(true);
              }}
            />
          </div>
        ) : url && !loading && !error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">Bu emlak ilanında görsel bulunamadı</p>
          </div>
        ) : null}
      </div>

      {selectedImage && <ImageDetails image={selectedImage} />}

      {showGallery && selectedImage && (
        <GalleryView
          images={images}
          initialImage={selectedImage}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}