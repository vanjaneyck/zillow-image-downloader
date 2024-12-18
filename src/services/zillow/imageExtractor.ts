import axios from 'axios';
import * as cheerio from 'cheerio';
import { ImageItem } from './types';

const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

export async function extractZillowImages(url: string): Promise<ImageItem[]> {
  // Validate URL
  if (!url.includes('zillow.com/homedetails')) {
    throw new Error('Please provide a valid Zillow listing URL');
  }

  // Try each proxy until successful
  for (const proxy of PROXY_URLS) {
    try {
      const response = await axios.get(`${proxy}${encodeURIComponent(url)}`, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
        }
      });

      const $ = cheerio.load(response.data);
      const images: ImageItem[] = [];
      const uniqueUrls = new Set<string>();

      // Extract from picture elements
      $('picture').each((_, picture) => {
        $(picture).find('source').each((_, source) => {
          const srcset = $(source).attr('srcset');
          if (srcset?.includes('zillowstatic.com')) {
            const urls = srcset.split(',')
              .map(src => src.trim().split(' ')[0])
              .filter(url => url.includes('zillowstatic.com'))
              .map(url => url.replace(/^\/\//, 'https://'));

            urls.forEach(url => {
              const baseUrl = url
                .replace(/\?.*$/, '')
                .replace(/(_[a-z]+)?\.(?:jpg|webp)/, '');
              
              const imageUrl = `${baseUrl}_f.webp`;
              
              if (!uniqueUrls.has(imageUrl)) {
                uniqueUrls.add(imageUrl);
                images.push({
                  id: String(images.length + 1),
                  url: imageUrl,
                  thumbnail: `${baseUrl}_a.webp`,
                  title: `Image ${images.length + 1}`
                });
              }
            });
          }
        });
      });

      if (images.length > 0) {
        return images;
      }
    } catch (error) {
      console.warn(`Failed with proxy ${proxy}:`, error);
      continue;
    }
  }

  throw new Error('Failed to extract images from the listing');
}