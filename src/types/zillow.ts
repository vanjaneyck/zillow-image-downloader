export interface ZillowPhoto {
  url: string;
  caption?: string;
  timestamp?: string;
}

export interface ZillowApiResponse {
  zpid: string;
  photos: ZillowPhoto[];
  homeStatus: string;
  price: number;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
  };
}