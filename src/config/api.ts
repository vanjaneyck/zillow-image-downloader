export const API_CONFIG = {
  ZILLOW: {
    BASE_URL: 'https://www.zillow.com/homedetails/',
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    TIMEOUT: 30000, // Increased timeout
    RETRIES: 3,
    RETRY_DELAY: 1000,
    HEADERS: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    }
  },
  CORS_PROXIES: [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/',
    'https://proxy.cors.sh/'
  ]
} as const;

export const ERROR_MESSAGES = {
  INVALID_URL: 'Lütfen geçerli bir Zillow URL\'si girin',
  API_ERROR: 'Zillow\'dan veri alınamadı',
  NO_IMAGES: 'Bu emlak ilanında görsel bulunamadı',
  TIMEOUT: 'İstek zaman aşımına uğradı',
  PARSING_ERROR: 'Veri işlenirken hata oluştu',
  RATE_LIMIT: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
  ACCESS_DENIED: 'Erişim engellendi. Lütfen daha sonra tekrar deneyin.'
} as const;