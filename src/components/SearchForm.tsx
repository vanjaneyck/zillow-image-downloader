import React from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export function SearchForm({ url, onUrlChange, onSubmit, disabled }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Zillow emlak ilanı URL'sini girin..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !url.trim()}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Görselleri Getir
      </button>
      <p className="text-sm text-gray-500 pl-4">
        Örnek: https://www.zillow.com/homedetails/123-address/12345_zpid/
      </p>
    </form>
  );
}