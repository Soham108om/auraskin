import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-8 font-sans font-light text-sm text-[#222222]/80 leading-relaxed">
      <div className="text-center space-y-2 border-b border-[#E8DEC9]/20 pb-4">
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">Legal & Privacy</span>
        <h1 className="text-3xl font-serif text-[#222222] font-semibold">Privacy Policy</h1>
      </div>

      <p>
        At AuraSkin, we respect your privacy. This policy outlines what data we gather during your visit to the site, how we process it, and how we keep it secure.
      </p>

      <h3 className="text-lg font-serif text-[#222222] pt-4 font-semibold">1. Data We Collect</h3>
      <p>
        We may collect contact information (name, address, email address) when you place orders, subscribe to newsletters, or submit diagnostic quiz results. We also collect usage metrics (using GA4 tag cookies) to optimize your browsing experience.
      </p>

      <h3 className="text-lg font-serif text-[#222222] pt-4 font-semibold">2. How We Use Data</h3>
      <p>
        Your data is primarily used to fulfill orders, deliver routine consultation results, send promotional newsletters, and debug site performance metrics. We never sell or share your data with unauthorized advertising partners.
      </p>

      <h3 className="text-lg font-serif text-[#222222] pt-4 font-semibold">3. Your Rights</h3>
      <p>
        You have the right to request a copy of your personal data, request corrections, or ask for complete deletion of your files from our active directories. Contact concierge@auraskin.com for requests.
      </p>
    </div>
  );
};
