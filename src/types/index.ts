export type CategoryId =
  | 'all'
  | 'fotografi'
  | 'desain'
  | 'kuliner'
  | 'renovasi'
  | 'tech'
  | 'barista'
  | 'mua'
  | 'elektronik'
  | 'musik';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  count?: number;
}

export interface PricePackage {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface WorkOutput {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  clientType?: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  businessName?: string;
  title: string;
  category: CategoryId;
  avatar: string;
  coverImage?: string;
  bio: string;
  city: string;
  fullAddress: string;
  whatsapp: string;
  instagram?: string;
  portfolioUrl?: string;
  startingPrice: number;
  priceUnit: string;
  pricePackages: PricePackage[];
  workOutputs: WorkOutput[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  verified: boolean;
  featured: boolean;
  status: 'active' | 'pending' | 'rejected';
  submittedAt: string;
  whatsappClicks: number;
  viewsCount: number;
}
