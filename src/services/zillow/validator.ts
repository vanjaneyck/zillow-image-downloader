import { ERROR_MESSAGES } from '../../config/constants';

export function validateZillowUrl(url: string): void {
  if (!url.trim()) {
    throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_URL);
  }

  try {
    const urlObj = new URL(url);
    const isValid = urlObj.hostname.includes('zillow.com') && 
                   urlObj.pathname.includes('/homedetails/');
    
    if (!isValid) {
      throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_URL);
    }
  } catch {
    throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_URL);
  }
}