import React from 'react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-8 font-sans font-light text-sm text-[#222222]/80 leading-relaxed">
      <div className="text-center space-y-2 border-b border-[#E8DEC9]/20 pb-4">
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">Legal & Terms</span>
        <h1 className="text-3xl font-serif text-[#222222] font-semibold">Terms & Conditions</h1>
      </div>

      <p>
        Welcome to AuraSkin. By accessing or using this website, you agree to comply with the terms and conditions outlined below.
      </p>

      <h3 className="text-lg font-serif text-[#222222] pt-4 font-semibold">1. Web Transactions</h3>
      <p>
        All orders are subject to acceptance and product availability. While we do our best to maintain accurate product descriptions and pricing details, errors may occasionally arise. We reserve the right to cancel orders in such cases.
      </p>

      <h3 className="text-lg font-serif text-[#222222] pt-4 font-semibold">2. Content & Trademarks</h3>
      <p>
        The content on this website, including formulas, blog posts, descriptions, layouts, and animations, is the property of AuraSkin and is protected by copyright regulations. Unauthorized reproduction is strictly prohibited.
      </p>

      <h3 className="text-lg font-serif text-[#222222] pt-4 font-semibold">3. Disclaimer of Liability</h3>
      <p>
        While all skincare formulations are clinically tested, results may vary individually. Please review ingredient lists carefully for personal allergens before purchasing. We are not liable for individual skin reactions.
      </p>
    </div>
  );
};
