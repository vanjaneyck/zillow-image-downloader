import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ImageList } from './ImageList';
import { useImageAnalysis } from '../../hooks/useImageAnalysis';

export function ImageAnalyzer() {
  const [url, setUrl] = useState('');
  const { images, loading, error, analyzeUrl } = useImageAnalysis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      analyzeUrl(url.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Görsel Analizi</h1>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Web sayfası URL'sini girin..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <p className="text-sm text-gray-500 pl-4">
            Analiz edilecek web sayfasının URL'sini girin
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
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="ml-3 text-gray-600">Görseller analiz ediliyor...</p>
          </div>
        ) : (
          <ImageList images={images} />
        )}
      </div>
    </div>
  );
}