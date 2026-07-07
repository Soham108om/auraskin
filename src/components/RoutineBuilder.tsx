import React, { useState } from 'react';
import { Sun, Moon, Check, Plus, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../utils/analytics';
import { formatRupee } from '../utils/currency';

interface RoutineStep {
  stepName: string;
  options: Product[];
}

export const RoutineBuilder: React.FC = () => {
  const { addToCart } = useCart();
  const [activeRoutine, setActiveRoutine] = useState<'AM' | 'PM'>('AM');
  
  // Custom states to track selected products for each step
  // AM Step products
  const amCleansers = products.filter(p => p.id === 'p1' || p.id === 'p15'); // Cleanser & Body Wash
  const amToners = products.filter(p => p.id === 'p7' || p.id === 'p8');     // Jasmine Toner & Rosewater Mist
  const amSerums = products.filter(p => p.id === 'p2' || p.id === 'p3');     // Vit C & Niacinamide
  const amProtectors = products.filter(p => p.id === 'p5' || p.id === 'p6'); // Ceramide Cream & Sunscreen

  // PM Step products
  const pmCleansers = products.filter(p => p.id === 'p1' || p.id === 'p16'); // Cleanser & Face Scrub
  const pmToners = products.filter(p => p.id === 'p7' || p.id === 'p8');     // Jasmine Toner & Rosewater Mist
  const pmSerums = products.filter(p => p.id === 'p4' || p.id === 'p17');    // Retinol & Acne Gel
  const pmMoisturizers = products.filter(p => p.id === 'p11' || p.id === 'p19'); // Sleeping Mask & Night Elixir

  const [selections, setSelections] = useState<{
    AM: { [key: string]: Product };
    PM: { [key: string]: Product };
  }>({
    AM: {
      "Cleanse": amCleansers[0],
      "Tone": amToners[0],
      "Treat": amSerums[0],
      "Protect": amProtectors[0]
    },
    PM: {
      "Cleanse": pmCleansers[0],
      "Tone": pmToners[0],
      "Treat": pmSerums[0],
      "Restore": pmMoisturizers[0]
    }
  });

  const selectProduct = (routine: 'AM' | 'PM', step: string, product: Product) => {
    setSelections(prev => ({
      ...prev,
      [routine]: {
        ...prev[routine],
        [step]: product
      }
    }));

    trackEvent({
      name: 'cta_click',
      params: { 
        cta_label: `Select Product - ${product.name} in ${routine} Routine`, 
        section_name: 'Routine Builder' 
      },
    });
  };

  const handleAddRoutineToCart = () => {
    const activeSelections = selections[activeRoutine];
    Object.values(activeSelections).forEach(product => {
      addToCart(product, 1);
    });

    trackEvent({
      name: 'cta_click',
      params: { 
        cta_label: `Add ${activeRoutine} Routine to Cart`, 
        section_name: 'Routine Builder' 
      },
    });
    alert(`Successfully added your custom ${activeRoutine} Routine to cart!`);
  };

  const stepsList = activeRoutine === 'AM' 
    ? [
        { name: "Cleanse", key: "Cleanse", options: amCleansers },
        { name: "Tone", key: "Tone", options: amToners },
        { name: "Treat", key: "Treat", options: amSerums },
        { name: "Protect", key: "Protect", options: amProtectors }
      ]
    : [
        { name: "Cleanse", key: "Cleanse", options: pmCleansers },
        { name: "Tone", key: "Tone", options: pmToners },
        { name: "Treat", key: "Treat", options: pmSerums },
        { name: "Restore", key: "Restore", options: pmMoisturizers }
      ];

  return (
    <div className="max-w-4xl mx-auto bg-[#FAF9F6] border border-[#E8DEC9]/30 rounded-2xl p-6 md:p-10 shadow-sm">
      {/* Routine Selector Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => {
            setActiveRoutine('AM');
            trackEvent({ name: 'cta_click', params: { cta_label: 'Switch to AM Routine', section_name: 'Routine Builder' } });
          }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold font-sans transition-all duration-300 ${
            activeRoutine === 'AM' 
              ? 'bg-[#FAF9F6] border-2 border-[#D4AF37] text-[#222222] shadow-sm'
              : 'border border-[#E8DEC9] text-[#222222]/60 hover:text-[#222222]'
          }`}
        >
          <Sun size={14} className={activeRoutine === 'AM' ? 'text-[#D4AF37]' : ''} />
          <span>Morning (AM) Ritual</span>
        </button>

        <button
          onClick={() => {
            setActiveRoutine('PM');
            trackEvent({ name: 'cta_click', params: { cta_label: 'Switch to PM Routine', section_name: 'Routine Builder' } });
          }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold font-sans transition-all duration-300 ${
            activeRoutine === 'PM' 
              ? 'bg-[#FAF9F6] border-2 border-[#222222] text-[#222222] shadow-sm'
              : 'border border-[#E8DEC9] text-[#222222]/60 hover:text-[#222222]'
          }`}
        >
          <Moon size={14} className={activeRoutine === 'PM' ? 'text-indigo-900' : ''} />
          <span>Evening (PM) Ritual</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Step Options Selector */}
        <div className="lg:col-span-2 space-y-6">
          {stepsList.map((step, idx) => {
            const selectedProduct = selections[activeRoutine][step.key];
            return (
              <div key={step.key} className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans">
                  Step 0{idx + 1} — {step.name}
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.options.map((product) => {
                    const isSelected = selectedProduct?.id === product.id;
                    const discounted = product.price - (product.price * product.discount) / 100;
                    return (
                      <div 
                        key={product.id}
                        onClick={() => selectProduct(activeRoutine, step.key, product)}
                        className={`cursor-pointer rounded-xl p-4 border transition-all flex items-center space-x-4 ${
                          isSelected 
                            ? 'border-[#D4AF37] bg-[#FFF8F2] shadow-sm'
                            : 'border-[#E8DEC9]/50 bg-[#FAF9F6] hover:bg-[#FFF8F2]/30 hover:border-[#E8DEC9]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-serif text-[#222222] truncate">{product.name}</h4>
                          <span className="text-[10px] text-[#222222]/60 font-sans">{formatRupee(discounted)}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-white' : 'border-[#E8DEC9] text-transparent'
                        }`}>
                          <Check size={12} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Routine Summary Box */}
        <div className="bg-[#FFF8F2]/50 border border-[#E8DEC9]/40 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-[#222222] border-b border-[#E8DEC9]/30 pb-2">
              Your Customized Routine
            </h3>
            
            <div className="space-y-3">
              {stepsList.map((step) => {
                const product = selections[activeRoutine][step.key];
                return (
                  <div key={step.key} className="text-xs flex flex-col space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#222222]/40 font-semibold font-sans">{step.name}</span>
                    <span className="text-[#222222] font-serif truncate font-light">{product ? product.name : "Select a product..."}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E8DEC9]/30">
            <div className="flex justify-between items-center text-xs font-sans tracking-wide">
              <span className="text-[#222222]/60">Total Value:</span>
              <span className="font-semibold text-base text-[#222222]">
                {formatRupee(Object.values(selections[activeRoutine]).reduce((sum, p) => sum + (p.price - (p.price * p.discount) / 100), 0))}
              </span>
            </div>
            
            <button
              onClick={handleAddRoutineToCart}
              className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <ShoppingBag size={13} />
              <span>Add System to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
