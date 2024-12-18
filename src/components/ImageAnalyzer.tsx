import React, { useState } from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';
import { useZillowImages } from '../hooks/useZillowImages';
import { ImageList } from './ImageList';
import { LoadingSpinner } from './LoadingSpinner';

export function ImageAnalyzer() {
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

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Zillow emlak ilanı URL'sini girin..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <p className="text-sm text-gray-500 pl-4">
                Örnek: https://www.zillow.com/homedetails/123-address/12345_zpid/
              </p>
            </form>
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
                <p className="mt-4 text-gray-600">Görseller yükleniyor...</p>
              </div>
            ) : (
              <ImageList images={images} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}