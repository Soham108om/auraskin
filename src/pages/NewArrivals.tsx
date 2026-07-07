import React from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface NewArrivalsProps {
  onQuickView: (product: Product) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ onQuickView }) => {
  const newArrivals = products.filter(p => p.isNewArrival);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Fresh Formulations</span>
        <h1 className="text-4xl font-serif text-[#222222]">New Arrivals</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Explore the latest achievements from our laboratories. Designed with next-generation cellular active complexes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {newArrivals.map((product) => (
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
