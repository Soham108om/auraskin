import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="space-y-24 pb-20 pt-12">
      {/* 1. Header Banner */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold font-sans block">Our Story</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#222222] font-light leading-tight">
          AuraSkin: The Beauty of <span className="serif-italic font-normal">Restraint.</span>
        </h1>
        <p className="text-sm md:text-base text-[#222222]/80 font-sans font-light max-w-xl mx-auto leading-relaxed">
          Formulated to feed the skin barrier. AuraSkin rejects clutter to introduce skin-minimalism—simplifying your daily routine while achieving elevated, natural radiance.
        </p>
      </section>

      {/* 2. Editorial Layout Panel */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5EFE6]/55 border border-[#E8DEC9]/20">
          <img 
            src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" 
            alt="Luxury bottles and natural light shadow" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-sans font-semibold">Formulation Core</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#222222]">The Science of Skin Barriers</h2>
          </div>

          <div className="text-sm text-[#222222]/80 leading-relaxed font-sans font-light space-y-4">
            <p>
              AuraSkin was founded on a simple realization: the skincare industry was overcomplicating beauty. By overloading skin with non-compatible actives, consumers were damaging their lipid barrier, leading to issues like dryness, redness, and accelerated aging.
            </p>
            <p>
              We decided to do things differently. Inspired by high-end minimal formulation design, we select concentrated botanical molecules that mimic the skin's natural chemistry—like sugarcane squalane and plant ceramides.
            </p>
            <p>
              By aligning our formulas with the skin's biological clock, we provide products that absorb instantly and repair deeply, showing visible improvements with zero side effects.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E8DEC9]/20">
            <div className="space-y-1">
              <span className="text-2xl font-serif text-[#D4AF37]">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans block">Vegan & Cruelty Free</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-serif text-[#D4AF37]">pH 5.5</span>
              <span className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans block">Balanced Bioavailability</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Standards Grid */}
      <section className="bg-[#FAF6F0] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <h3 className="text-2xl font-serif text-[#222222] text-center">Our Pillars</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E8DEC9]/20 space-y-3">
              <ShieldCheck className="text-[#D4AF37]" size={20} />
              <h4 className="text-base font-serif text-[#222222]">Clean Actives</h4>
              <p className="text-xs text-[#222222]/70 font-sans font-light leading-relaxed">Only clinical-grade ingredients with proven dermal benefits make it into our formulations.</p>
            </div>
            
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E8DEC9]/20 space-y-3">
              <Sparkles className="text-[#D4AF37]" size={20} />
              <h4 className="text-base font-serif text-[#222222]">Minimalism</h4>
              <p className="text-xs text-[#222222]/70 font-sans font-light leading-relaxed">Concentrated multipurpose products so you can maintain a highly effective 3-step ritual.</p>
            </div>

            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E8DEC9]/20 space-y-3">
              <Heart className="text-[#D4AF37]" size={20} />
              <h4 className="text-base font-serif text-[#222222]">Ethical Sourcing</h4>
              <p className="text-xs text-[#222222]/70 font-sans font-light leading-relaxed">We source plant extracts responsibly, utilizing recyclable glass containers for all serums.</p>
            </div>

            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E8DEC9]/20 space-y-3">
              <Award className="text-[#D4AF37]" size={20} />
              <h4 className="text-base font-serif text-[#222222]">Trial Proof</h4>
              <p className="text-xs text-[#222222]/70 font-sans font-light leading-relaxed">All products undergo rigorous dermatologist-supervised trial testing for absolute safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <h3 className="text-2xl font-serif text-[#222222]">Ready to Simplify Your Routine?</h3>
        <p className="text-xs text-[#222222]/60 font-sans max-w-sm mx-auto leading-relaxed">Take our intelligent skin diagnostic quiz to receive a curated routine based on your concerns.</p>
        <Link 
          to="/skin-quiz"
          className="inline-block bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-8 rounded-full transition-all active:scale-95 shadow-md"
        >
          Begin Skin Analysis
        </Link>
      </section>
    </div>
  );
};
