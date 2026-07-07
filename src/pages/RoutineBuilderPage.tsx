import React from 'react';
import { RoutineBuilder } from '../components/RoutineBuilder';

export const RoutineBuilderPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Ritual Architect</span>
        <h1 className="text-4xl font-serif text-[#222222]">AM / PM Routine Builder</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Mix and match our high-potency formulations to construct a balanced morning and evening ritual tailored to your skin's daily cycle.
        </p>
      </div>

      <RoutineBuilder />
    </div>
  );
};
