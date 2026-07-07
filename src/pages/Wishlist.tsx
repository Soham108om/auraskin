import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface WishlistProps {
  onQuickView: (product: Product) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onQuickView }) => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Favorites</span>
        <h1 className="text-4xl font-serif text-[#222222]">Your Wishlist</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Formulations saved during your skin research. Review and integrate them into your routine.
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={onQuickView} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <Heart size={36} className="mx-auto text-[#222222]/30" />
          <h3 className="text-xl font-serif text-[#222222]">Wishlist is currently empty</h3>
          <p className="text-xs text-[#222222]/60 font-sans max-w-xs mx-auto">
            Browse our clinical formulations index and click the heart icon on cards to save items.
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-[#222222] text-[#FAF9F6] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold"
          >
            Go to Shop
          </Link>
        </div>
      )}
    </div>
  );
};
