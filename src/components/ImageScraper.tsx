import React, { useState } from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';
import { useZillowImages } from '../hooks/useZillowImages';
import { ImageGrid } from './ImageGrid';
import { SearchForm } from './SearchForm';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';

export function ImageScraper() {
  const [url, setUrl] = useState('');
  const { images, loading, error, fetchImages } = useZillowImages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      fetchImages(url.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Zillow Görsel Galerisi</h1>
            </div>

            <SearchForm 
              url={url} 
              onUrlChange={setUrl} 
              onSubmit={handleSubmit} 
              disabled={loading}
            />
          </div>

          <div className="p-6">
            {error && <ErrorMessage message={error} />}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Görseller yükleniyor...</p>
              </div>
            ) : (
              <ImageGrid images={images} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}