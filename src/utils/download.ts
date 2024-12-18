import { extractAddressFromUrl } from './urlParser';

export async function downloadImages(urls: string[]) {
  // URL'den adresi çıkar
  const address = extractAddressFromUrl(window.location.href) || 'zillow-images';
  
  // Adresi dosya adı formatına çevir
  const baseFilename = address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Özel karakterleri tire ile değiştir
    .replace(/^-+|-+$/g, ''); // Baştaki ve sondaki tireleri kaldır

  for (let i = 0; i < urls.length; i++) {
    try {
      const response = await fetch(urls[i]);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Sıralı dosya adı oluştur
      const imageNumber = (i + 1).toString().padStart(2, '0');
      link.download = `${baseFilename}-${imageNumber}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      // İndirmeler arasında küçük bir gecikme ekle
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Download failed:', error);
    }
  }
}