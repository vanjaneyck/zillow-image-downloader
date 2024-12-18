export async function downloadImage(url: string): Promise<void> {
  if (!url) {
    throw new Error('Lütfen bir URL girin');
  }

  try {
    // Cors-anywhere proxy kullanarak isteği yönlendirelim
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const response = await fetch(proxyUrl + url, {
      headers: {
        'Origin': window.location.origin
      }
    });

    if (!response.ok) {
      throw new Error('Görsel indirilemedi');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('Geçersiz görsel formatı');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Dosya adını URL'den veya content-disposition header'dan al
    const filename = getFilenameFromResponse(response) || url.split('/').pop() || 'image';
    link.download = sanitizeFilename(filename);
    
    // Görünmez link oluştur ve tıkla
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Temizlik yap
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Görsel indirme işlemi başarısız oldu');
  }
}

function getFilenameFromResponse(response: Response): string | null {
  const disposition = response.headers.get('content-disposition');
  if (!disposition) return null;
  
  const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (!filenameMatch) return null;
  
  return filenameMatch[1].replace(/['"]/g, '');
}

function sanitizeFilename(filename: string): string {
  // Geçersiz karakterleri temizle
  return filename.replace(/[/\\?%*:|"<>]/g, '-');
}