export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  fullSize: string;
  index: number;
}

export interface GalleryMetadata {
  zpid: string;
  totalImages: number;
  currentIndex: number;
}

export interface GalleryResponse {
  images: GalleryImage[];
  metadata: GalleryMetadata;
}