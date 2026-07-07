import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { formatRupee } from '../utils/currency';


interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [hovered, setHovered] = useState(false);

  const discountedPrice = product.price - (product.price * product.discount) / 100;
  const isLiked = isInWishlist(product.id);

  return (
    <div 
      className="group relative flex flex-col w-full bg-[#FAF9F6] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 border border-[#E8DEC9]/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full glass border border-[#FAF9F6]/20 transition-transform duration-300 hover:scale-110 active:scale-95 ${
          isLiked ? 'text-[#D4AF37]' : 'text-[#222222]/60 hover:text-[#222222]'
        }`}
      >
        <Heart size={15} fill={isLiked ? "#D4AF37" : "none"} />
      </button>

      {/* Discount Label */}
      {product.discount > 0 && (
        <span className="absolute top-4 left-4 z-10 bg-[#D4AF37] text-white text-[9px] font-semibold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
          {product.discount}% OFF
        </span>
      )}

      {/* Image Gallery Wrap */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F5EFE6]/30">
        <img 
          src={hovered && product.hoverImage ? product.hoverImage : product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
        />

        {/* Hover Action Triggers */}
        <div className="absolute inset-0 bg-[#222222]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 bg-[#FAF9F6] hover:bg-[#222222] text-[#222222] hover:text-white rounded-full transition-all duration-300 shadow-md transform translate-y-4 group-hover:translate-y-0 active:scale-90"
            title="Quick View"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="p-3 bg-[#FAF9F6] hover:bg-[#222222] text-[#222222] hover:text-white rounded-full transition-all duration-300 shadow-md transform translate-y-4 group-hover:translate-y-0 delay-75 active:scale-90"
            title="Add to Cart"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </Link>

      {/* Copy Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#222222]/50 font-sans font-medium block">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`} className="block mt-1">
            <h4 className="text-base text-[#222222] hover:text-[#D4AF37] font-serif transition-colors duration-300 line-clamp-1">
              {product.name}
            </h4>
          </Link>
          <div className="flex items-center space-x-2 mt-1.5">
            {/* Simple Stars */}
            <div className="flex text-[#D4AF37]">
              {"★".repeat(Math.floor(product.rating))}
              {product.rating % 1 !== 0 && "½"}
            </div>
            <span className="text-[10px] text-[#222222]/40">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#E8DEC9]/20 pt-3">
          <span className="text-xs text-[#222222]/60 font-sans">{product.size}</span>
          <div className="flex items-center space-x-1.5 font-sans">
            {product.discount > 0 ? (
              <>
                <span className="text-xs line-through text-[#222222]/40">{formatRupee(product.price)}</span>
                <span className="text-sm font-semibold text-[#D4AF37]">{formatRupee(discountedPrice)}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-[#222222]">{formatRupee(product.price)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
