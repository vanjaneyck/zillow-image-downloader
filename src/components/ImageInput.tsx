import React from 'react';

interface ImageInputProps {
  url: string;
  onChange: (url: string) => void;
}

export function ImageInput({ url, onChange }: ImageInputProps) {
  return (
    <div>
      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
        Görsel URL'si
      </label>
      <input
        type="url"
        id="url"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        required
      />
    </div>
  );
}