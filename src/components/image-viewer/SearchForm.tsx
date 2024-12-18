import React from 'react';

interface SearchFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function SearchForm({ url, onUrlChange, onSubmit, isLoading }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Zillow emlak ilanı URL'sini girin..."
          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Görselleri Getir
      </button>
    </form>
  );
}