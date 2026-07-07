import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      q: "What makes AuraSkin different from standard skincare brands?",
      a: "AuraSkin is founded on the philosophy of skin-minimalism. Instead of multi-step routines that sensitize the skin barrier, we design high-concentration, multifunctional items. This simplifies your daily rituals while maximizing visible improvements."
    },
    {
      q: "Are your formulations safe for highly sensitive skin?",
      a: "Yes. Our products are formulated to be non-irritating and pH balanced (around pH 5.5). We avoid harsh chemical sulfates, drying alcohols, synthetic fragrances, and artificial parabens, using soothing botanical bases instead."
    },
    {
      q: "How should I store my active serums (like Vitamin C or Retinol)?",
      a: "We recommend storing your active serums in a cool, dry place away from direct sunlight. To ensure maximum potency and delay oxidation, seal the caps tightly after every use."
    },
    {
      q: "Do you ship worldwide?",
      a: "Yes. We offer standard and expedited shipping worldwide. Complimentary standard shipping is automatically applied on all orders exceeding $50."
    },
    {
      q: "Can I combine the Skin Quiz results with the Routine Builder?",
      a: "Absolutely! We recommend taking the Skin Quiz to understand your skin's profile, and then using the Routine Builder to select AM/PM formulas that fit those recommendations."
    }
  ];

  const handleToggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);

    if (isOpening) {
      trackEvent({
        name: 'cta_click',
        params: { cta_label: `FAQ Accordion - Open Q${index + 1}`, section_name: 'FAQ Page' },
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Support Library</span>
        <h1 className="text-4xl font-serif text-[#222222]">Frequently Asked Questions</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light">
          Find instant answers to common questions about our products, ingredients, and delivery services.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="bg-[#FFF8F2]/30 border border-[#E8DEC9]/20 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => handleToggle(idx)}
                className="w-full text-left p-6 flex justify-between items-center space-x-4 text-sm font-serif text-[#222222] hover:text-[#D4AF37] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-[#D4AF37] flex-shrink-0">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-xs text-[#222222]/80 leading-relaxed font-sans font-light animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
