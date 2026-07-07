import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { formatRupee, getProductPrice } from '../utils/currency';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [qty, setQty] = useState(1);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedScent, setSelectedScent] = useState('');

  // Reset selected size/scent when product changes
  useEffect(() => {
    if (product) {
      setQty(1);
      setSelectedSize(product.sizes?.[0] || product.size);
      setSelectedScent(product.scents?.[0] || "Signature Blend");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentPrice = getProductPrice(product, selectedSize);
  const discountedPrice = currentPrice - (currentPrice * product.discount) / 100;
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize, selectedScent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#222222]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl h-full bg-[#FAF9F6] shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-y-auto">
        <div className="p-6 border-b border-[#E8DEC9]/40 flex items-center justify-between sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans">Quick View</span>
          <button 
            onClick={onClose}
            className="p-2 text-[#222222]/60 hover:text-[#222222] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex-1 space-y-8">
          {/* Images */}
          <div className="aspect-[4/3] w-full rounded-lg overflow-hidden relative bg-[#F5EFE6]/50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] font-semibold tracking-widest px-3 py-1 uppercase rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-[0.15em] text-[#222222]/60 font-sans">{product.category}</span>
                <h3 className="text-2xl font-serif text-[#222222] mt-1">{product.name}</h3>
              </div>
              <div className="text-right">
                {product.discount > 0 ? (
                  <div className="flex flex-col items-end">
                    <span className="text-sm line-through text-[#222222]/40 font-sans">{formatRupee(currentPrice)}</span>
                    <span className="text-lg font-serif text-[#D4AF37] font-bold">{formatRupee(discountedPrice)}</span>
                  </div>
                ) : (
                  <span className="text-lg font-serif text-[#222222] font-semibold">{formatRupee(currentPrice)}</span>
                )}
              </div>
            </div>

            <p className="text-sm text-[#222222]/80 leading-relaxed font-sans font-light">
              {product.description}
            </p>

            {/* Sizes & Scents selectors */}
            <div className="space-y-4 pt-2">
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-sans font-semibold block">Select Size</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => {
                      const szPrice = getProductPrice(product, sz);
                      const extraPrice = szPrice - product.price;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-1.5 rounded-full border text-xs font-sans transition-all duration-300 ${
                            selectedSize === sz
                              ? 'border-[#D4AF37] bg-[#FFF8F2] text-[#222222] font-medium'
                              : 'border-[#E8DEC9]/50 text-[#222222]/70 hover:border-[#E8DEC9] bg-transparent'
                          }`}
                        >
                          {sz} {extraPrice > 0 && `(+${formatRupee(extraPrice)})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.scents && product.scents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-sans font-semibold block">Select Scent / Formula variant</span>
                  <div className="flex flex-wrap gap-2">
                    {product.scents.map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setSelectedScent(sc)}
                        className={`px-3.5 py-1.5 rounded-full border text-xs font-sans transition-all duration-300 ${
                          selectedScent === sc
                            ? 'border-[#D4AF37] bg-[#FFF8F2] text-[#222222] font-medium'
                            : 'border-[#E8DEC9]/50 text-[#222222]/70 hover:border-[#E8DEC9] bg-transparent'
                        }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#E8DEC9]/40 pt-4 flex justify-between items-center text-xs tracking-wider uppercase font-sans text-[#222222]/70">
              <span>Skin Compatibility: <strong className="text-[#222222]">{product.skinType.join(', ')}</strong></span>
            </div>
          </div>

          {/* Core Benefits */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#222222] font-semibold font-sans">Core Benefits</h4>
            <ul className="space-y-2">
              {product.benefits.slice(0, 3).map((benefit, i) => (
                <li key={i} className="text-xs text-[#222222]/75 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="flex items-center space-x-4 pt-4 border-t border-[#E8DEC9]/20">
            {/* Qty Selector */}
            <div className="flex items-center border border-[#E8DEC9] rounded-full overflow-hidden bg-[#FAF9F6]">
              <button 
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 hover:bg-[#F5EFE6] text-[#222222] transition-colors text-sm font-sans"
              >
                -
              </button>
              <span className="px-3 text-sm font-sans font-medium text-[#222222]">{qty}</span>
              <button 
                type="button"
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2 hover:bg-[#F5EFE6] text-[#222222] transition-colors text-sm font-sans"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <ShoppingBag size={14} />
              <span>Add to Routine</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-full border border-[#E8DEC9] transition-all hover:bg-[#FFF8F2] ${isLiked ? 'text-[#D4AF37] bg-[#FFF8F2]' : 'text-[#222222]'}`}
            >
              <Heart size={16} fill={isLiked ? "#D4AF37" : "none"} />
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link 
              to={`/product/${product.id}`}
              onClick={onClose}
              className="inline-flex items-center space-x-2 text-xs font-sans tracking-[0.15em] uppercase text-[#D4AF37] hover:text-[#222222] font-semibold transition-colors"
            >
              <span>View Full Experience</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
