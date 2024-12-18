export const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://thingproxy.freeboard.io/fetch/'
] as const;

export const IMAGE_SIZES = {
  THUMBNAIL: 'cc_ft_384',
  MEDIUM: 'cc_ft_768',
  LARGE: 'uncropped_scaled_within_1536_1152'
} as const;

export const IMAGE_FORMATS = ['webp', 'jpg'] as const;