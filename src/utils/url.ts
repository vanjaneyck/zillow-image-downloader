export function normalizeUrl(url: string): string {
  return url
    .replace(/^\/\//, 'https://')
    .replace(/\?.*$/, '')
    .replace(/&.*$/, '');
}

export function getHighResImageUrl(url: string): string {
  const baseUrl = normalizeUrl(url);
  // Try different high-res suffixes in order of preference
  const suffixes = ['_f.jpg', '_uhd.jpg', '_o.jpg', '_h.jpg'];
  
  for (const suffix of suffixes) {
    const highResUrl = baseUrl.replace(/(_[a-z]+)?\.(?:jpg|jpeg|webp)/, suffix);
    return highResUrl;
  }
  
  return baseUrl;
}

export function getThumbnailUrl(url: string): string {
  const baseUrl = normalizeUrl(url);
  return baseUrl.replace(/(_[a-z]+)?\.(?:jpg|jpeg|webp)/, '_a.jpg');
}