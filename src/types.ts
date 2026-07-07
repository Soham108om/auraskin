export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  skinType: string[]; // e.g., ["Dry", "Oily", "Sensitive", "Combination", "Normal", "All"]
  concern: string[];   // e.g., ["Acne", "Aging", "Dullness", "Dryness", "Dark Spots", "Sun Protection"]
  benefits: string[];
  rating: number;
  reviewsCount: number;
  price: number;
  discount: number; // percentage, e.g., 15 for 15%
  image: string;
  hoverImage: string;
  images: string[];
  size: string;     // e.g., "50ml", "120ml"
  sizes?: string[];
  scents?: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  reviews: Review[];
  faqs: FAQItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedScent?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}
