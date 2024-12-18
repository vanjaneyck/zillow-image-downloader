export function extractZpid(url: string): string | null {
  try {
    const match = url.match(/\/(\d+)_zpid/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function isValidZillowUrl(url: string): boolean {
  return /^https?:\/\/(?:www\.)?zillow\.com\/homedetails\/[^\/]+\/\d+_zpid/.test(url);
}

export function createImageUrl(zpid: string, index: number, format: 'webp' | 'jpg', size: 'f' | 'a' = 'f'): string {
  return `https://photos.zillowstatic.com/fp/${zpid}-${index}_${size}.${format}`;
}