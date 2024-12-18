export interface ImageMetadata {
  url: string;
  width?: number;
  height?: number;
  fileSize?: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
}

export interface AnalyzedImage extends ImageMetadata {
  thumbnail: string;
  aspectRatio?: number;
}