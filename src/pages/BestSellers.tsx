import React from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface BestSellersProps {
  onQuickView: (product: Product) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ onQuickView }) => {
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Highly Coveted</span>
        <h1 className="text-4xl font-serif text-[#222222]">The Best Sellers</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Formulations that have earned a permanent spot in luxury routines worldwide. Trusted for results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {bestSellers.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={onQuickView} 
          />
        ))}
      </div>
    </div>
  );
};
