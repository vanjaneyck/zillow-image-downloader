export function getHighQualityImageUrl(url: string): string {
  const baseUrl = normalizeImageUrl(url);
  const format = getImageFormat(url);
  return `${baseUrl.replace(/\.[^.]+$/, '')}_f.${format}`;
}

export function getThumbnailUrl(url: string): string {
  const baseUrl = normalizeImageUrl(url);
  const format = getImageFormat(url);
  return `${baseUrl.replace(/\.[^.]+$/, '')}_a.${format}`;
}

function normalizeImageUrl(url: string): string {
  return url
    .replace(/^\/\//, 'https://')
    .replace(/\?.*$/, '');
}

function getImageFormat(url: string): string {
  const format = url.split('.').pop()?.toLowerCase();
  return format === 'webp' ? 'webp' : 'jpg';
}