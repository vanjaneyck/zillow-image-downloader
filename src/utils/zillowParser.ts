import { ERROR_MESSAGES } from '../config/api';

export function extractZpidFromUrl(url: string): string {
  const match = url.match(/\/(\d+)_zpid/);
  if (!match) {
    throw new Error(ERROR_MESSAGES.INVALID_URL);
  }
  return match[1];
}

export function isValidZillowUrl(url: string): boolean {
  return /^https?:\/\/(?:www\.)?zillow\.com\/homedetails\/[^\s]+/.test(url);
}