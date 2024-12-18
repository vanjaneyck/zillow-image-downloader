import { ERROR_MESSAGES } from '../../config/constants';

export function validateZillowUrl(url: string): void {
  if (!url.trim()) {
    throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_URL);
  }

  const isValid = /^https?:\/\/(?:www\.)?zillow\.com\/homedetails\/[^\s]+/.test(url);
  if (!isValid) {
    throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_URL);
  }
}