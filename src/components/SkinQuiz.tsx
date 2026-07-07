import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { formatRupee } from '../utils/currency';

interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "How does your skin feel in the afternoon?",
    options: [
      { label: "Tight, dry, or flakey in areas", value: "Dry" },
      { label: "Shiny, greasy, or oil-slicked all over", value: "Oily" },
      { label: "Shiny in the T-zone, but dry/normal elsewhere", value: "Combination" },
      { label: "Comfortable, smooth, and balanced", value: "Normal" }
    ]
  },
  {
    id: 2,
    text: "What is your primary skin concern that you want to target?",
    options: [
      { label: "Acne breakouts, blackheads, or clogged pores", value: "Acne" },
      { label: "Fine lines, wrinkles, loss of skin elasticity", value: "Aging" },
      { label: "Lack of glow, dullness, or uneven skin tone", value: "Dullness" },
      { label: "Dehydration, tightness, or dry patches", value: "Dryness" },
      { label: "Stubborn dark spots, acne scars, or hyperpigmentation", value: "Dark Spots" }
    ]
  },
  {
    id: 3,
    text: "How does your skin react to new products or heavy fragrances?",
    options: [
      { label: "Frequently turns red, burns, or feels itchy", value: "Sensitive" },
      { label: "Occasionally gets minor irritation, but usually fine", value: "Normal" },
      { label: "Rarely reacts; can handle high-strength ingredients", value: "Resilient" }
    ]
  }
];

export const SkinQuiz: React.FC = () => {
  const { addToCart } = useCart();
  const [step, setStep] = useState(0); // 0: intro, 1-3: questions, 4: results
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const startQuiz = () => {
    trackEvent({
      name: 'cta_click',
      params: { cta_label: 'Start Skin Quiz', section_name: 'Skin Quiz Intro' },
    });
    setAnswers([]);
    setStep(1);
  };

  const handleSelectOption = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < quizQuestions.length) {
      setStep(step + 1);
    } else {
      // Calculate Recommendations
      // answers[0] = skinType, answers[1] = concern, answers[2] = sensitivity
      const skinTypeAnswer = answers[0] || value;
      const concernAnswer = answers[1] || value;
      const isSensitive = answers[2] === 'Sensitive' || value === 'Sensitive';

      // Filtering logic
      let matched = products.filter(p => {
        // Match skin type (either specific or All)
        const typeMatch = p.skinType.includes(skinTypeAnswer) || p.skinType.includes("All");
        // Match concern
        const concernMatch = p.concern.includes(concernAnswer);
        return typeMatch && concernMatch;
      });

      // Fallback in case match is empty
      if (matched.length === 0) {
        matched = products.filter(p => p.skinType.includes(skinTypeAnswer) || p.skinType.includes("All")).slice(0, 3);
      }

      // If sensitive, make sure we suggest the cleansing milk or barrier cream
      if (isSensitive) {
        const cleanser = products.find(p => p.id === 'p1'); // Cleansing Milk
        const barrierCream = products.find(p => p.id === 'p5'); // Ceramide Cream
        if (cleanser && !matched.some(m => m.id === cleanser.id)) {
          matched.unshift(cleanser);
        }
        if (barrierCream && !matched.some(m => m.id === barrierCream.id)) {
          matched.push(barrierCream);
        }
      }

      const uniqueMatched = Array.from(new Set(matched)).slice(0, 3);
      setRecommendations(uniqueMatched);
      setStep(4);

      trackEvent({
        name: 'cta_click',
        params: { cta_label: 'Complete Skin Quiz', section_name: 'Skin Quiz Step 3' },
      });
    }
  };

  const resetQuiz = () => {
    setAnswers([]);
    setStep(0);
    setRecommendations([]);
  };

  const addAllToCart = () => {
    recommendations.forEach(product => {
      addToCart(product, 1);
    });
    trackEvent({
      name: 'cta_click',
      params: { cta_label: 'Add Quiz Bundle To Cart', section_name: 'Skin Quiz Results' },
    });
    alert("Recommended routine bundle added to your cart!");
  };

  return (
    <div className="max-w-xl mx-auto bg-[#FAF9F6] border border-[#E8DEC9]/30 rounded-2xl p-8 md:p-12 shadow-sm text-center">
      {step === 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="mx-auto w-12 h-12 bg-[#FFF8F2] text-[#D4AF37] flex items-center justify-center rounded-full">
            <Sparkles size={24} />
          </div>
          <h2 className="text-3xl font-serif text-[#222222]">Discover Your Aura Ritual</h2>
          <p className="text-sm text-[#222222]/80 leading-relaxed font-sans font-light">
            Take our 2-minute intelligent skin diagnostic. Answer three simple questions, and our formulation index will curate a customized 3-step routine aligned to your skin's biological needs.
          </p>
          <button 
            onClick={startQuiz}
            className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <span>Begin Diagnostics</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {step >= 1 && step <= quizQuestions.length && (
        <div className="space-y-8 animate-fade-in">
          {/* Progress Bar */}
          <div className="w-full bg-[#F5EFE6] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#D4AF37] h-full transition-all duration-500" 
              style={{ width: `${(step / quizQuestions.length) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Question {step} of {quizQuestions.length}</span>
            <h3 className="text-xl md:text-2xl font-serif text-[#222222]">{quizQuestions[step - 1].text}</h3>
          </div>

          <div className="flex flex-col space-y-3">
            {quizQuestions[step - 1].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option.value)}
                className="w-full text-left p-4 rounded-xl border border-[#E8DEC9] bg-[#FAF9F6] hover:bg-[#FFF8F2] hover:border-[#D4AF37] hover:text-[#222222] text-[#222222]/80 text-sm font-sans font-light transition-all active:scale-98"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (() => {
        // Calculate diagnostic stats
        const skinType = answers[0] || '';
        const sensitivity = answers[2] || '';
        
        let hydration = 80;
        if (skinType === 'Dry') hydration = 35;
        else if (skinType === 'Combination') hydration = 65;
        else if (skinType === 'Oily') hydration = 50;

        let sebum = 85;
        if (skinType === 'Oily') sebum = 30;
        else if (skinType === 'Combination') sebum = 55;

        let barrier = 80;
        if (sensitivity === 'Sensitive') barrier = 45;
        else if (sensitivity === 'Resilient') barrier = 95;

        return (
        <div className="space-y-8 animate-fade-in text-left">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Diagnostic Report</span>
            <h3 className="text-2xl font-serif text-[#222222]">Your Curated Aura Ritual</h3>
            <p className="text-xs text-[#222222]/60 font-sans">
              Based on your replies, we recommend this tailored, high-performance skincare system:
            </p>
          </div>

          {/* Skin Analysis Scorecard */}
          <div className="bg-[#FFF8F2]/60 border border-[#E8DEC9]/35 rounded-2xl p-5 space-y-4 font-sans text-xs">
            <h4 className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-semibold mb-1">Biological Parameters Summary</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 font-medium text-[#222222]">
                  <span>Hydration Levels</span>
                  <span className={hydration < 50 ? "text-red-600 font-bold" : "text-[#D4AF37]"}>{hydration}%</span>
                </div>
                <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#E8DEC9]/20">
                  <div 
                    className={`h-full transition-all duration-1000 ${hydration < 50 ? "bg-red-500/85" : "bg-[#D4AF37]"}`} 
                    style={{ width: `${hydration}%` }}
                  />
                </div>
                {hydration < 50 && <span className="text-[9px] text-[#222222]/50 mt-0.5 block italic">Crucially low. Needs lipid replenishment.</span>}
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium text-[#222222]">
                  <span>Sebum Balance</span>
                  <span className={sebum < 50 ? "text-orange-500 font-bold" : "text-[#D4AF37]"}>{sebum}%</span>
                </div>
                <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#E8DEC9]/20">
                  <div 
                    className={`h-full transition-all duration-1000 ${sebum < 50 ? "bg-orange-400" : "bg-[#D4AF37]"}`} 
                    style={{ width: `${sebum}%` }}
                  />
                </div>
                {sebum < 50 && <span className="text-[9px] text-[#222222]/50 mt-0.5 block italic">Over-active sebum. Clarification required.</span>}
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium text-[#222222]">
                  <span>Lipid Barrier Integrity</span>
                  <span className={barrier < 50 ? "text-red-500 font-bold" : "text-[#D4AF37]"}>{barrier}%</span>
                </div>
                <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#E8DEC9]/20">
                  <div 
                    className={`h-full transition-all duration-1000 ${barrier < 50 ? "bg-red-400" : "bg-[#D4AF37]"}`} 
                    style={{ width: `${barrier}%` }}
                  />
                </div>
                {barrier < 50 && <span className="text-[9px] text-[#222222]/50 mt-0.5 block italic">Compromised barrier. Ceramide rebuilding recommended.</span>}
              </div>
            </div>
          </div>

          {/* Recommended items */}
          <div className="space-y-4">
            {recommendations.map((product, idx) => {
              const discPrice = product.price - (product.price * product.discount) / 100;
              return (
                <div 
                  key={product.id} 
                  className="flex items-center space-x-4 bg-[#FFF8F2]/50 p-4 border border-[#E8DEC9]/20 rounded-xl"
                >
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-sans font-semibold">Step {idx + 1}: {product.category}</span>
                    <h4 className="text-sm font-serif text-[#222222] truncate">{product.name}</h4>
                    <span className="text-xs text-[#222222]/70 font-sans">{formatRupee(discPrice)}</span>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="text-xs uppercase tracking-wider font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={addAllToCart}
              className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <span>Add Custom Bundle to Cart</span>
            </button>
            
            <button
              onClick={resetQuiz}
              className="w-full border border-[#E8DEC9] hover:bg-[#FAF9F6] text-[#222222]/70 hover:text-[#222222] font-sans text-xs uppercase tracking-[0.15em] py-3 px-6 rounded-full flex items-center justify-center space-x-2 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Retake Diagnostics</span>
            </button>
          </div>
        </div>
        );
      })()}
    </div>
  );
};
