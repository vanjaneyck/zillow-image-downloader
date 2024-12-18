import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { downloadImage } from '../utils/downloadImage';
import { ErrorMessage } from './ErrorMessage';
import { ImageInput } from './ImageInput';
import { DownloadButton } from './DownloadButton';

export function ImageDownloader() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Lütfen bir URL girin');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await downloadImage(url);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Görsel İndirici</h1>
      </div>

      <form onSubmit={handleDownload} className="space-y-6">
        <ImageInput url={url} onChange={setUrl} />
        {error && <ErrorMessage message={error} />}
        <DownloadButton loading={loading} />
      </form>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Görselin URL'sini yapıştırın ve indirme butonuna tıklayın
      </p>
    </div>
  );
}