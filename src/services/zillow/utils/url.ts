export function extractZpid(url: string): string | null {
  try {
    const zpidMatch = url.match(/\/(\d+)_zpid/);
    return zpidMatch ? zpidMatch[1] : null;
  } catch {
    return null;
  }
}

export function isValidZillowUrl(url: string): boolean {
  return /^https?:\/\/(?:www\.)?zillow\.com\/homedetails\/[^\/]+\/\d+_zpid/.test(url);
}

export function createImageUrl(zpid: string, index: number, size: 'f' | 'a' = 'f'): string {
  return `https://photos.zillowstatic.com/fp/${zpid}-${index}_${size}.jpg`;
}