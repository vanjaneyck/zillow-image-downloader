import React from 'react';
import { Download } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface DownloadButtonProps {
  loading: boolean;
}

export function DownloadButton({ loading }: DownloadButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <LoadingSpinner /> : (
        <>
          <Download className="w-5 h-5" />
          Görseli İndir
        </>
      )}
    </button>
  );
}