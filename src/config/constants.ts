export const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/',
] as const;

export const FETCH_CONFIG = {
  TIMEOUT: 15000,
  RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

export const ERROR_MESSAGES = {
  VALIDATION: {
    INVALID_URL: 'Lütfen geçerli bir Zillow URL\'si girin',
  },
  NETWORK: {
    FAILED: 'Bağlantı hatası oluştu',
    TIMEOUT: 'İstek zaman aşımına uğradı',
  },
  PARSING: {
    NO_IMAGES: 'Bu emlak ilanında görsel bulunamadı',
    FAILED: 'Görsel bilgileri alınamadı',
  }
} as const;