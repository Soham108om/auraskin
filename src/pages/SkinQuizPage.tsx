import React from 'react';
import { SkinQuiz } from '../components/SkinQuiz';

export const SkinQuizPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Self Diagnostics</span>
        <h1 className="text-4xl font-serif text-[#222222]">Skin Intelligence Quiz</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Align your products with your skin's biological parameters. Complete our brief diagnostic mapping to reveal your recommended system.
        </p>
      </div>

      <SkinQuiz />
    </div>
  );
};
