export function isListingImage(url: string): boolean {
  // URL formatını kontrol et
  const listingImagePattern = /photos\.zillowstatic\.com\/fp\/[a-f0-9]+-(?:uncropped_scaled_within_1536_1152|cc_ft_\d+)\.(?:webp|jpg)/i;
  
  return listingImagePattern.test(url);
}