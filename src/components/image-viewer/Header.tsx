import React from 'react';

export function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <img 
        src="https://www.zillowstatic.com/s3/pfs/static/z-logo-default-visual-refresh.svg"
        alt="Zillow Logo"
        className="h-6"
      />
      <h1 className="text-xl font-semibold text-gray-800">Görsel Galerisi</h1>
    </div>
  );
}