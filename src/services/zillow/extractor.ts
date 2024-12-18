import { ImageItem } from './types';
import { ZillowError } from './errors';

const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export async function extractImages(url: string): Promise<ImageItem[]> {
  try {
    // ZPID'yi URL'den çıkar
    const zpidMatch = url.match(/\/(\d+)_zpid/);
    if (!zpidMatch) {
      throw new ZillowError('INVALID_URL', 'Geçerli bir Zillow URL\'si değil');
    }
    const zpid = zpidMatch[1];

    // Sayfayı getir
    const html = await fetchPage(url);
    
    // Galeri container'ını bul
    const galleryMatch = html.match(/data-testid="hollywood-gallery-images"[^>]*>(.*?)<\/div>/s);
    if (!galleryMatch) {
      throw new ZillowError('NO_GALLERY', 'Galeri bulunamadı');
    }

    // Sadece galeri içindeki görselleri al
    const galleryContent = galleryMatch[1];
    const imagePattern = /photos\.zillowstatic\.com\/fp\/([a-f0-9]+)-cc_ft/g;
    const matches = [...galleryContent.matchAll(imagePattern)];
    
    // Her hash için görsel oluştur
    const images: ImageItem[] = [];
    
    for (const match of matches) {
      const hash = match[1];
      const baseUrl = `https://photos.zillowstatic.com/fp/${hash}`;
      
      // Görsel boyutlarını kontrol et
      const imageUrl = `${baseUrl}-uncropped_scaled_within_1536_1152.webp`;
      const thumbnailUrl = `${baseUrl}-cc_ft_384.webp`;
      
      // Thumbnail'in varlığını kontrol et
      const exists = await checkImageExists(thumbnailUrl);
      
      if (exists) {
        images.push({
          id: `${zpid}-${images.length}`,
          url: imageUrl,
          thumbnail: thumbnailUrl,
          title: `Görsel ${images.length + 1}`
        });
      }
    }

    if (images.length === 0) {
      throw new ZillowError('NO_IMAGES', 'Geçerli görsel bulunamadı');
    }

    return images;
  } catch (error) {
    console.error('Görsel çekme hatası:', error);
    throw error instanceof ZillowError ? error : new ZillowError('FETCH_ERROR', 'Görseller yüklenirken bir hata oluştu');
  }
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new ZillowError('FETCH_ERROR', 'Sayfa yüklenemedi');
  }
  return response.text();
}

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'Accept': 'image/webp,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}