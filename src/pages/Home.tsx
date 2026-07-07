import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Sparkle, 
  Eye, 
  Droplet, 
  Activity, 
  Compass, 
  Cpu, 
  Bookmark, 
  ChevronRight, 
  Sun, 
  Moon, 
  ShoppingBag, 
  Check,
  Star
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';
import { trackEvent } from '../utils/analytics';
import { formatRupee, getProductPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onQuickView }) => {
  const { addToCart } = useCart();
  const [beforeAfterActive, setBeforeAfterActive] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);

  // 1. Skincare Routine Quick-Selector States
  const [selectedConcern, setSelectedConcern] = useState<'Dullness' | 'Acne' | 'Aging' | 'Dryness'>('Dullness');
  const [routineRoutineTab, setRoutineRoutineTab] = useState<'AM' | 'PM'>('AM');

  // Curated Routine Presets Map (Product IDs)
  const routinePresets = {
    Dullness: {
      AM: ['p1', 'p2', 'p6'], // Cleansing Milk, Vitamin C, Sunscreen
      PM: ['p1', 'p7', 'p19']  // Cleansing Milk, Jasmine Toner, Sleeping Elixir
    },
    Acne: {
      AM: ['p1', 'p3', 'p6'],  // Cleansing Milk, Niacinamide, Sunscreen
      PM: ['p1', 'p17', 'p5']  // Cleansing Milk, Acne Gel, Ceramide Cream
    },
    Aging: {
      AM: ['p1', 'p7', 'p6'],  // Cleansing Milk, Jasmine Toner, Sunscreen
      PM: ['p1', 'p4', 'p19']  // Cleansing Milk, Retinol, Sleeping Elixir
    },
    Dryness: {
      AM: ['p1', 'p8', 'p5'],  // Cleansing Milk, Rose Mist, Ceramide Cream
      PM: ['p1', 'p9', 'p11']  // Cleansing Milk, Facial Oil, Sleeping Mask
    }
  };

  const getPresetProducts = (concern: 'Dullness' | 'Acne' | 'Aging' | 'Dryness', time: 'AM' | 'PM') => {
    const ids = routinePresets[concern][time];
    return ids.map(id => products.find(p => p.id === id)).filter((p): p is Product => !!p);
  };

  const handleAddPresetToCart = (concern: 'Dullness' | 'Acne' | 'Aging' | 'Dryness', time: 'AM' | 'PM') => {
    const items = getPresetProducts(concern, time);
    items.forEach(item => {
      addToCart(item, 1);
    });
    trackEvent({
      name: 'cta_click',
      params: { cta_label: `Add Preset Routine: ${concern} (${time})`, section_name: 'Interactive Routine Quick-Selector' }
    });
    alert(`Successfully added the curated ${concern} ${time} routine bundle (3 items) to your cart!`);
  };

  // 2. Active Ingredients Spotlight States
  const [selectedIngredient, setSelectedIngredient] = useState<string>('Ceramides');
  
  const ingredientsSpotlight = [
    {
      name: "Ceramides",
      desc: "Fortifies the skin's lipid barrier, locking in moisture and defending against redness and sensitizing agents.",
      function: "Barrier Rebuilding & Moisture Retention",
      matches: ["p5", "p11", "p19"]
    },
    {
      name: "Vitamin C",
      desc: "A high-strength antioxidant that blocks environmental free-radicals, brightens dark spots, and stimulates collagen.",
      function: "Luminosity & UV Defense Co-Factor",
      matches: ["p2", "p12", "p18"]
    },
    {
      name: "Niacinamide",
      desc: "Improves skin elasticity, dramatically shrinks enlarged pores, fades post-acne marks, and balances sebum levels.",
      function: "Pore Refiner & Hyperpigmentation Fader",
      matches: ["p3", "p14", "p18"]
    },
    {
      name: "Retinol & Bakuchiol",
      desc: "Accelerates cellular turnover, sweeping away dull skin cells to smooth wrinkles and support natural elastin.",
      function: "Textural Renewal & Wrinkle Ironing",
      matches: ["p4", "p19"]
    },
    {
      name: "Sugarcane Squalane",
      desc: "A molecularly stable, non-comedogenic lipid that mimics natural skin oils to seal in serums without congestion.",
      function: "Biocompatible Moisture Lock",
      matches: ["p9", "p1", "p11"]
    }
  ];

  const currentIngredientData = ingredientsSpotlight.find(ing => ing.name === selectedIngredient) || ingredientsSpotlight[0];
  const currentIngredientProducts = currentIngredientData.matches
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  // 3. Skin Barrier Calculator States
  const [hydrationValue, setHydrationValue] = useState<number>(60);
  const [sensitivityValue, setSensitivityValue] = useState<number>(30);
  const [exposureValue, setExposureValue] = useState<number>(40);

  // Real-time calculation logic
  const barrierHealthScore = Math.round(
    hydrationValue * 0.5 + (100 - sensitivityValue) * 0.3 + (100 - exposureValue) * 0.2
  );

  let barrierDiagnostic = {
    status: "Healthy",
    desc: "Your skin barrier is resilient, hydrated, and functioning optimally. Keep protecting it.",
    colorClass: "text-[#D4AF37]",
    bgBarClass: "bg-[#D4AF37]",
    recommendedId: "p2" // Vitamin C Radiance Serum
  };

  if (barrierHealthScore < 50) {
    barrierDiagnostic = {
      status: "Critically Compromised",
      desc: "Your lipid layers are severely depleted, allowing moisture to escape. Redness and flaking are highly likely. Focus entirely on recovery.",
      colorClass: "text-red-500",
      bgBarClass: "bg-red-500",
      recommendedId: "p5" // Ceramide barrier Cream
    };
  } else if (barrierHealthScore >= 50 && barrierHealthScore < 75) {
    barrierDiagnostic = {
      status: "Stressed & Dehydrated",
      desc: "Your protective shield is weakened. Skin is losing hydration faster than normal and feels dry or slightly congested.",
      colorClass: "text-orange-500",
      bgBarClass: "bg-orange-400",
      recommendedId: "p9" // Squalane & Rose Gold Oil
    };
  }

  const barrierRecommendedProduct = products.find(p => p.id === barrierDiagnostic.recommendedId);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const handleCTAClick = (label: string) => {
    trackEvent({
      name: 'cta_click',
      params: { cta_label: label, section_name: 'Hero Section' },
    });
  };

  const skinTypes = [
    { name: "Dry", desc: "Replenish moisture and seal your barrier", bg: "bg-[#FFF8F2]" },
    { name: "Oily", desc: "Regulate sebum and tighten enlarged pores", bg: "bg-[#FAF6F0]" },
    { name: "Sensitive", desc: "Calm redness with ultra-gentle botanical bases", bg: "bg-[#F5EFE6]" },
    { name: "Combination", desc: "Balance the T-zone while hydrating dry spots", bg: "bg-[#FAF9F6]" }
  ];

  const beforeAfterStudies = [
    {
      concern: "Acne & Texture Renewal",
      timeline: "4 Weeks Routine",
      beforeImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop",
      afterImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
      details: "User reported 82% decrease in breakouts and 91% smoother texture using Niacinamide-10 and Hydra-Nectar Cleansing Milk."
    },
    {
      concern: "Hyperpigmentation & Glow",
      timeline: "6 Weeks Routine",
      beforeImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
      afterImg: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
      details: "96% of participants observed visible fading of dark spots and improved luminosity using the C-Luminescence Serum."
    }
  ];

  const testimonials = [
    { quote: "AuraSkin has changed my relationship with my skin. The Ceramide Rich Cream healed my peeling skin barrier within 3 days. Beautiful minimal glass jars too.", user: "Adriana L. (Verified Buyer)", rating: 5 },
    { quote: "My skin is highly sensitive and reacts to almost everything. AuraSkin's cleansing milk is exceptionally soothing. Truly a top-tier luxury line.", user: "Julian M. (Verified Buyer)", rating: 5 },
    { quote: "Minimalism at its absolute finest. I replaced my 6 serums with just the C-Luminescence in the morning and Retinol-A at night. My skin has never looked healthier.", user: "Sophia K. (Verified Buyer)", rating: 5 }
  ];

  return (
    <div className="space-y-24 pb-20 bg-[#FAF9F6] text-[#222222]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Banner Image Background */}
        <div className="absolute inset-0 bg-[#222222]">
          <img 
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop" 
            alt="Luxury Skincare AuraSkin Banner" 
            className="w-full h-full object-cover opacity-60 scale-100 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-[#222222]/30" />
        </div>

        {/* Hero Content */}
        <div className="relative text-center text-white max-w-4xl px-6 space-y-6 md:space-y-8 z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold font-sans block animate-fade-in-up">
            Introducing Skin-Minimalism
          </span>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight font-light text-[#FAF9F6] animate-fade-in-up">
            Radiance Refined. <br />
            <span className="serif-italic font-normal text-[#D4AF37]">Designed for the Skin Barrier.</span>
          </h1>
          <p className="text-sm md:text-base text-[#FAF9F6]/85 font-sans font-light max-w-xl mx-auto leading-relaxed animate-fade-in-up">
            Feed your skin what it understands. High-performance, luxury skincare systems engineered to simplify your routine and optimize natural cellular repair.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up">
            <Link 
              to="/shop" 
              onClick={() => handleCTAClick('Shop Now')}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#FAF9F6] text-[#222222] font-sans text-xs uppercase tracking-[0.2em] font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg"
            >
              Shop The Collection
            </Link>
            <Link 
              to="/skin-quiz"
              onClick={() => handleCTAClick('Start Consultation')}
              className="w-full sm:w-auto border-2 border-[#FAF9F6] hover:bg-[#FAF9F6] text-[#FAF9F6] hover:text-[#222222] font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-8 rounded-full transition-all duration-300"
            >
              Skin Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Routine Quick-Selector Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans">Curated Presets</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#222222]">Instant Skincare Systems</h2>
          <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
            Choose your core skin concern to preview a clinically formulated 3-step ritual. Add the entire ritual with a single click.
          </p>
        </div>

        {/* Concern Selector Tabs */}
        <div className="flex justify-center space-x-2 md:space-x-4 border-b border-[#E8DEC9]/35 pb-4">
          {(['Dullness', 'Acne', 'Aging', 'Dryness'] as const).map((concern) => (
            <button
              key={concern}
              onClick={() => {
                setSelectedConcern(concern);
                trackEvent({ name: 'category_click', params: { category_name: `Preset Concern - ${concern}` } });
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all ${
                selectedConcern === concern
                  ? 'bg-[#222222] text-[#FAF9F6] shadow-md'
                  : 'text-[#222222]/60 hover:text-[#222222] border border-[#E8DEC9]/50 hover:bg-[#FFF8F2]/30'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>

        <div className="bg-[#FFF8F2]/30 border border-[#E8DEC9]/30 rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left panel: Info & Time toggle */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans block">Curated Solution</span>
              <h3 className="text-2xl font-serif text-[#222222] capitalize">{selectedConcern} Correction</h3>
              <p className="text-xs text-[#222222]/70 leading-relaxed font-sans font-light">
                This simple yet targeted 3-step sequence has been paired specifically to reduce {selectedConcern.toLowerCase()} concerns by balancing lipid moisture, delivering key active compounds, and protecting the skin barrier.
              </p>
            </div>

            {/* Time of Day Toggle buttons */}
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-wider text-[#222222]/40 font-semibold block font-sans">Select Ritual Phase</span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setRoutineRoutineTab('AM')}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold font-sans transition-all border ${
                    routineRoutineTab === 'AM'
                      ? 'bg-[#FAF9F6] border-[#D4AF37] text-[#222222] shadow-sm'
                      : 'border-[#E8DEC9]/50 text-[#222222]/60 hover:text-[#222222]'
                  }`}
                >
                  <Sun size={14} className={routineRoutineTab === 'AM' ? 'text-[#D4AF37]' : ''} />
                  <span>Morning (AM)</span>
                </button>
                <button
                  onClick={() => setRoutineRoutineTab('PM')}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold font-sans transition-all border ${
                    routineRoutineTab === 'PM'
                      ? 'bg-[#FAF9F6] border-[#222222] text-[#222222] shadow-sm'
                      : 'border-[#E8DEC9]/50 text-[#222222]/60 hover:text-[#222222]'
                  }`}
                >
                  <Moon size={14} className={routineRoutineTab === 'PM' ? 'text-indigo-900' : ''} />
                  <span>Evening (PM)</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => handleAddPresetToCart(selectedConcern, routineRoutineTab)}
              className="w-full bg-[#222222] hover:bg-[#222222]/90 text-[#FAF9F6] text-xs uppercase tracking-[0.18em] font-sans font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
            >
              <ShoppingBag size={14} />
              <span>Add curation to Cart</span>
            </button>
          </div>

          {/* Middle/Right: Curated Routine steps listing */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#222222]/40 font-semibold block font-sans">Curated Sequence (3 Steps)</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getPresetProducts(selectedConcern, routineRoutineTab).map((product, idx) => {
                const discountedPrice = product.price - (product.price * product.discount) / 100;
                return (
                  <div key={product.id} className="bg-[#FAF9F6] border border-[#E8DEC9]/20 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                    <div className="space-y-4">
                      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#F5EFE6]/30 relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute bottom-2 left-2 bg-[#222222]/80 text-[#FAF9F6] text-[8px] font-sans tracking-widest font-semibold px-2 py-0.5 rounded uppercase">
                          Step 0{idx + 1}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-semibold font-sans">{product.category}</span>
                        <h4 className="text-xs font-serif text-[#222222] mt-0.5 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{product.name}</h4>
                        <p className="text-[10px] text-[#222222]/50 font-sans mt-1 line-clamp-2">{product.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E8DEC9]/25 pt-3 mt-4 text-xs">
                      <span className="text-[#222222]/50">{product.size}</span>
                      <span className="font-semibold text-[#222222] font-sans">{formatRupee(discountedPrice)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Active Ingredients Spotlight Section */}
      <section className="bg-[#FAF6F0] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left panel: Interactive ingredient tags */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Active Compounding</span>
              <h2 className="text-3xl font-serif text-[#222222]">Ingredients Spotlight</h2>
              <p className="text-xs text-[#222222]/60 font-sans font-light leading-relaxed">
                Click an ingredient compound to view its biochemical functions and reveal formulating products that incorporate it.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              {ingredientsSpotlight.map((ing) => (
                <button
                  key={ing.name}
                  onClick={() => {
                    setSelectedIngredient(ing.name);
                    trackEvent({ name: 'cta_click', params: { cta_label: `Ingredient Click - ${ing.name}`, section_name: 'Ingredients Spotlight' } });
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    selectedIngredient === ing.name
                      ? 'border-[#D4AF37] bg-[#FAF9F6] shadow-sm'
                      : 'border-[#E8DEC9]/40 hover:bg-[#FFF8F2]/30 hover:border-[#E8DEC9]/80'
                  }`}
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-serif text-[#222222] font-semibold">{ing.name}</h4>
                    <span className="text-[9px] uppercase tracking-wider text-[#222222]/45 font-sans font-semibold block">{ing.function}</span>
                  </div>
                  <ChevronRight size={14} className={`text-[#222222]/40 transition-transform ${selectedIngredient === ing.name ? 'translate-x-1 text-[#D4AF37]' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Middle/Right panel: Ingredient scientific overview & product scroll */}
          <div className="lg:col-span-2 bg-[#FAF9F6] border border-[#E8DEC9]/35 rounded-3xl p-8 space-y-8 shadow-sm">
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-semibold block font-sans">Active Spotlight Breakdown</span>
              <h3 className="text-2xl font-serif text-[#222222]">{currentIngredientData.name} Compound</h3>
              <p className="text-xs text-[#222222]/85 leading-relaxed font-sans font-light italic border-l-2 border-[#D4AF37] pl-4">
                "{currentIngredientData.desc}"
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#222222]/50 font-semibold block font-sans">Matching Library Formulations</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentIngredientProducts.map((product) => {
                  const discountedPrice = product.price - (product.price * product.discount) / 100;
                  return (
                    <div key={product.id} className="border border-[#E8DEC9]/20 rounded-xl p-4 flex flex-col justify-between space-y-4 bg-[#FFF8F2]/20 hover:border-[#D4AF37]/50 transition-all duration-300">
                      <div className="space-y-3">
                        <div className="aspect-square rounded-lg overflow-hidden bg-[#F5EFE6]/50">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-[#222222]/40 font-semibold font-sans">{product.category}</span>
                          <h4 className="text-xs font-serif text-[#222222] mt-0.5 truncate">{product.name}</h4>
                          <span className="text-xs text-[#D4AF37] font-sans font-semibold mt-1 block">{formatRupee(discountedPrice)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onQuickView(product)}
                        className="w-full border border-[#E8DEC9] hover:bg-[#222222] text-[#222222] hover:text-[#FAF9F6] text-[9px] font-sans font-semibold py-2 rounded-lg transition-all"
                      >
                        Quick Specs
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Skin Barrier Calculator Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Sliders Panel */}
        <div className="space-y-8 bg-[#FFF8F2]/40 border border-[#E8DEC9]/35 rounded-3xl p-8 shadow-sm">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans">Diagnostics Engine</span>
            <h2 className="text-3xl font-serif text-[#222222]">Skin Barrier Health Calculator</h2>
            <p className="text-xs text-[#222222]/60 font-sans font-light">
              Tune the sliders representing your skin parameters. Our calculation engine will estimate your lipid barrier integrity and recommend an recovery treatment in real time.
            </p>
          </div>

          <div className="space-y-6">
            {/* Slider 1: Hydration Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans">
                <span className="font-semibold text-[#222222]">Hydration Level</span>
                <span className="text-[#D4AF37] font-bold">{hydrationValue}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={hydrationValue} 
                onChange={(e) => setHydrationValue(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
              <span className="text-[9px] text-[#222222]/45 font-sans block">0%: Severe dryness & cracking • 100%: Dewy and plump</span>
            </div>

            {/* Slider 2: Sensitivity level */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans">
                <span className="font-semibold text-[#222222]">Sensitivity & Redness Frequency</span>
                <span className="text-[#D4AF37] font-bold">{sensitivityValue}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sensitivityValue} 
                onChange={(e) => setSensitivityValue(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
              <span className="text-[9px] text-[#222222]/45 font-sans block">0%: Never reacts • 100%: Immediate stinging and burning</span>
            </div>

            {/* Slider 3: Environmental stress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans">
                <span className="font-semibold text-[#222222]">Environmental Stress Exposure</span>
                <span className="text-[#D4AF37] font-bold">{exposureValue}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={exposureValue} 
                onChange={(e) => setExposureValue(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
              <span className="text-[9px] text-[#222222]/45 font-sans block">Air Conditioning, heavy sun, UV rays, or urban pollution</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Prescriptive Report & Recommended Product */}
        <div className="bg-[#FAF9F6] border border-[#E8DEC9]/45 rounded-3xl p-8 space-y-6 flex flex-col justify-between min-h-[460px] shadow-sm">
          <div className="space-y-6">
            <div className="text-center space-y-2 border-b border-[#E8DEC9]/20 pb-4">
              <span className="text-[9px] uppercase tracking-wider text-[#222222]/50 font-sans font-bold">Barrier Diagnostic Score</span>
              <div className="flex items-baseline justify-center space-x-1">
                <span className={`text-5xl font-serif font-bold ${barrierDiagnostic.colorClass}`}>{barrierHealthScore}%</span>
                <span className="text-xs text-[#222222]/45 font-sans">/ 100</span>
              </div>
              <span className={`text-xs uppercase tracking-widest font-semibold font-sans block mt-1 ${barrierDiagnostic.colorClass}`}>
                {barrierDiagnostic.status}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#222222]/50 font-sans block font-semibold">Diagnosis Analysis</span>
              <p className="text-xs text-[#222222]/75 leading-relaxed font-sans font-light">
                {barrierDiagnostic.desc}
              </p>
            </div>
          </div>

          {barrierRecommendedProduct && (
            <div className="border-t border-[#E8DEC9]/20 pt-6 mt-4 space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-[#222222]/40 font-semibold block font-sans">Prescribed Recovery Formula</span>
              <div className="flex items-center space-x-4 bg-[#FFF8F2]/30 p-4 border border-[#E8DEC9]/15 rounded-2xl">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={barrierRecommendedProduct.image} alt={barrierRecommendedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-sans font-semibold">{barrierRecommendedProduct.category}</span>
                  <h4 className="text-xs font-serif text-[#222222] truncate">{barrierRecommendedProduct.name}</h4>
                  <span className="text-xs font-semibold text-[#222222]/80 font-sans mt-0.5 block">{formatRupee(barrierRecommendedProduct.price)}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => onQuickView(barrierRecommendedProduct)}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#222222] hover:text-[#D4AF37] font-sans transition-colors text-right"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      addToCart(barrierRecommendedProduct, 1);
                      alert(`${barrierRecommendedProduct.name} added to cart!`);
                    }}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] hover:text-[#222222] font-sans transition-colors text-right"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Before & After Section (Simulation) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 bg-[#FFF8F2]/60 rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Clinical Proof</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#222222] leading-tight">
            Visible Transformations. <br />
            <span className="serif-italic font-normal">Backed by study trials.</span>
          </h2>
          <p className="text-sm text-[#222222]/80 leading-relaxed font-sans font-light">
            We believe in honest skincare parameters. Our independent clinical trial subjects demonstrated massive visible improvement. Click to cycle through target concerns:
          </p>
          <div className="flex space-x-2">
            {beforeAfterStudies.map((study, idx) => (
              <button
                key={idx}
                onClick={() => setBeforeAfterActive(idx)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider font-sans transition-all ${
                  beforeAfterActive === idx 
                    ? 'bg-[#222222] text-white' 
                    : 'bg-[#F5EFE6] text-[#222222]/60 hover:text-[#222222]'
                }`}
              >
                {study.concern}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#222222]/70 italic font-sans leading-relaxed border-l-2 border-[#D4AF37] pl-4">
            {beforeAfterStudies[beforeAfterActive].details}
          </p>
        </div>
        
        {/* Before / After Image Split Slider */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-gray-200 select-none shadow-lg border border-[#E8DEC9]/20 group">
            {/* After Image (Background) */}
            <img 
              src={beforeAfterStudies[beforeAfterActive].afterImg} 
              alt="Week 6 Glow (After)" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-[9px] font-semibold tracking-widest px-2.5 py-0.5 rounded-full z-10 font-sans shadow-sm">
              AFTER (GLOW)
            </div>

            {/* Before Image (Revealed by width) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none border-r-2 border-white/85 z-10"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={beforeAfterStudies[beforeAfterActive].beforeImg} 
                alt="Baseline (Before)" 
                className="absolute inset-0 max-w-none h-full object-cover filter saturate-75 brightness-95"
                style={{ width: '384px', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute top-4 left-4 bg-[#222222]/80 text-[#FAF9F6] text-[9px] font-semibold tracking-widest px-2.5 py-0.5 rounded-full z-10 font-sans shadow-sm">
                BEFORE
              </div>
            </div>

            {/* Slider Handle line & indicator */}
            <div 
              className="absolute inset-y-0 pointer-events-none flex items-center justify-center z-20"
              style={{ left: `calc(${sliderPos}% - 16px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-white border border-[#D4AF37] shadow-md flex items-center justify-center text-xs text-[#222222] font-semibold font-sans group-hover:scale-110 transition-transform">
                ↔
              </div>
            </div>

            {/* Drag controller input */}
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              title="Slide to compare before and after"
            />
          </div>
          <p className="text-[10px] text-center text-[#222222]/40 font-sans uppercase tracking-widest">
            Drag slider left & right to compare results
          </p>
        </div>
      </section>

      {/* 6. Shop by Skin Type */}
      <section className="bg-[#FFF8F2]/40 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Targeted Routines</span>
            <h2 className="text-3xl font-serif text-[#222222]">Shop by Skin Type</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skinTypes.map((type) => (
              <Link 
                key={type.name} 
                to={`/shop?skinType=${type.name}`}
                className={`${type.bg} p-8 rounded-2xl border border-[#E8DEC9]/20 hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between aspect-square group shadow-sm`}
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-[#222222]">{type.name} Skin</h3>
                  <p className="text-xs text-[#222222]/70 leading-relaxed font-sans font-light">
                    {type.desc}
                  </p>
                </div>
                <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-semibold text-[#222222] group-hover:text-[#D4AF37] transition-colors">
                  <span>Explore Ritual</span>
                  <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Best Sellers */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Highly Coveted</span>
            <h2 className="text-3xl font-serif text-[#222222]">The Best Sellers</h2>
          </div>
          <Link 
            to="/shop" 
            className="text-xs uppercase tracking-[0.15em] font-semibold text-[#222222] hover:text-[#D4AF37] border-b border-[#222222] pb-0.5"
          >
            Shop All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={onQuickView} 
            />
          ))}
        </div>
      </section>

      {/* 8. Customer Reviews / Testimonial Slider */}
      <section className="bg-[#222222] text-[#FAF9F6] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Aura Reviews</span>
            <h2 className="text-3xl font-serif text-white">Loved by Glowing Complexions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="text-[#D4AF37] text-xs flex">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="#D4AF37" className="mr-0.5 text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#FAF9F6]/80 leading-relaxed font-sans font-light italic">
                    "{test.quote}"
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#FAF9F6]/40 font-sans block">{test.user}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Instagram-style Gallery */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Aura Moments</span>
          <h2 className="text-3xl font-serif text-[#222222]">#AuraSkinRitual</h2>
          <p className="text-xs text-[#222222]/50 font-sans">Share your shelfie to be featured in our luxury gallery</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&auto=format&fit=crop"
          ].map((url, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative">
              <img src={url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#222222]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="text-[10px] uppercase tracking-widest font-semibold">View Post</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
