import { ImageItem } from './types';
import { ZillowError } from './errors';
import { isListingImage } from '../../utils/imageFilter';

const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export async function scrapeZillowImages(url: string): Promise<ImageItem[]> {
  try {
    // ZPID'yi URL'den çıkar
    const zpidMatch = url.match(/\/(\d+)_zpid/);
    if (!zpidMatch) {
      throw new ZillowError('INVALID_URL', 'Geçerli bir Zillow URL\'si değil');
    }
    const zpid = zpidMatch[1];

    // Sayfayı getir
    const html = await fetchPage(url);
    
    // Görsel hash'lerini çıkar - sadece ilan görsellerini hedefle
    const hashPattern = /photos\.zillowstatic\.com\/fp\/([a-f0-9]+)-(?:uncropped|cc_ft)/g;
    const matches = [...html.matchAll(hashPattern)];
    
    // Hash'leri sırala ve benzersiz olanları al
    const uniqueHashes = [...new Set(matches.map(m => m[1]))];

    // Her hash için görsel oluştur
    const images: ImageItem[] = [];
    
    for (const hash of uniqueHashes) {
      const baseUrl = `https://photos.zillowstatic.com/fp/${hash}`;
      const imageUrl = `${baseUrl}-uncropped_scaled_within_1536_1152.webp`;
      
      // URL'in geçerli bir ilan görseli olduğunu kontrol et
      if (isListingImage(imageUrl)) {
        const thumbnailUrl = `${baseUrl}-cc_ft_384.webp`;
        const exists = await checkImageExists(thumbnailUrl);
        
        if (exists) {
          images.push({
            id: `${zpid}-${hash}`,
            url: imageUrl,
            thumbnail: thumbnailUrl,
            title: `Görsel ${images.length + 1}`
          });
        }
      }
    }

    if (images.length === 0) {
      throw new ZillowError('NO_IMAGES', 'Görsel bulunamadı');
    }

    return images;
  } catch (error) {
    console.error('Zillow scraping error:', error);
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
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}