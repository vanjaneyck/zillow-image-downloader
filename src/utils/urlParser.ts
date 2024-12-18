export function extractAddressFromUrl(url: string): string | null {
  try {
    // Zillow URL formatı: /homedetails/ADDRESS/ZPID
    const match = url.match(/\/homedetails\/([^\/]+)\//);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return null;
  } catch {
    return null;
  }
}