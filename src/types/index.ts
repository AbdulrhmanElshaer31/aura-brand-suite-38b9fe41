export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'fresh' | 'sweet' | 'woody';
  size: string;
  status: 'available' | 'out_of_stock';
  badge?: 'new' | 'best_seller' | 'limited';
  images: string[];
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  views: number;
  orderClicks: number;
  createdAt: string;
}

export interface BrandSettings {
  brandName: string;
  logoUrl: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
  whatsappTemplate: string;
  aboutText: string;
}

export interface DailyStats {
  date: string;
  clicks: number;
}
