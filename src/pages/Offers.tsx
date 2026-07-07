import React from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { trackEvent } from '../utils/analytics';
import { Copy } from 'lucide-react';

interface OffersProps {
  onQuickView: (product: Product) => void;
}

export const Offers: React.FC<OffersProps> = ({ onQuickView }) => {
  const discounted = products.filter(p => p.discount > 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    trackEvent({
      name: 'cta_click',
      params: { cta_label: `Copy Coupon - ${code}`, section_name: 'Offers Page' },
    });
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Exclusive Rituals</span>
        <h1 className="text-4xl font-serif text-[#222222]">Special Offers & Ritual Codes</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Explore introductory pricing on selected library formulations and copy checkout coupon codes.
        </p>
      </div>

      {/* Coupon Codes Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-[#FFF8F2]/60 border border-[#E8DEC9]/30 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-sans font-semibold">15% off site-wide</span>
            <h3 className="text-lg font-serif text-[#222222] font-semibold">AURAGLOW</h3>
            <p className="text-xs text-[#222222]/65 font-sans">Applicable on all products and bundles. Cannot be combined.</p>
          </div>
          <button
            onClick={() => handleCopyCode('AURAGLOW')}
            className="flex items-center space-x-1.5 bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-[10px] uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-all active:scale-95"
          >
            <Copy size={12} />
            <span>Copy</span>
          </button>
        </div>

        <div className="bg-[#FAF6F0] border border-[#E8DEC9]/30 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-sans font-semibold">10% off for newcomers</span>
            <h3 className="text-lg font-serif text-[#222222] font-semibold">WELCOME10</h3>
            <p className="text-xs text-[#222222]/65 font-sans">Apply on your first order. Compliment sample set included.</p>
          </div>
          <button
            onClick={() => handleCopyCode('WELCOME10')}
            className="flex items-center space-x-1.5 bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-[10px] uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-all active:scale-95"
          >
            <Copy size={12} />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Discounted Product Grid */}
      <div className="space-y-8">
        <h2 className="text-2xl font-serif text-[#222222] border-b border-[#E8DEC9]/20 pb-2">Active Formulation Markdowns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {discounted.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={onQuickView} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
