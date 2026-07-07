import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Instagram, MessageCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      trackEvent({
        name: 'newsletter_signup',
        params: { email: email.trim() },
      });
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleFooterLinkClick = (label: string) => {
    trackEvent({
      name: 'cta_click',
      params: { cta_label: `Footer - ${label}`, section_name: 'Footer' },
    });
  };

  return (
    <footer className="bg-[#222222] text-[#FAF9F6] pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
        {/* Brand Story Column */}
        <div className="space-y-6">
          <Link 
            to="/" 
            onClick={() => handleFooterLinkClick('Brand Logo')}
            className="text-lg font-serif tracking-[0.3em] font-bold block"
          >
            AURA<span className="text-[#D4AF37]">SKIN</span>
          </Link>
          <p className="text-xs text-[#FAF9F6]/60 leading-relaxed font-sans font-light">
            Formulated on skin-minimalism. We build luxury, high-performance skincare routines designed to feed your skin barrier and bring forth your natural radiance.
          </p>
          <div className="flex space-x-4 text-[#FAF9F6]/40">
            <a href="#instagram" className="hover:text-[#D4AF37] transition-colors"><Instagram size={16} /></a>
            <a href="#mail" className="hover:text-[#D4AF37] transition-colors"><Mail size={16} /></a>
            <a href="#chat" className="hover:text-[#D4AF37] transition-colors"><MessageCircle size={16} /></a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#D4AF37]">Shop Collections</h4>
          <ul className="space-y-2 text-xs font-sans font-light text-[#FAF9F6]/75">
            <li>
              <Link to="/shop?category=Serums" onClick={() => handleFooterLinkClick('Serums')} className="hover:text-[#D4AF37] transition-colors">
                Concentrated Serums
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Cleansers" onClick={() => handleFooterLinkClick('Cleansers')} className="hover:text-[#D4AF37] transition-colors">
                Gentle Cleansers
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Moisturizers" onClick={() => handleFooterLinkClick('Moisturizers')} className="hover:text-[#D4AF37] transition-colors">
                Barrier Recovery
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Body Care" onClick={() => handleFooterLinkClick('Body Care')} className="hover:text-[#D4AF37] transition-colors">
                Luxury Body Care
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#D4AF37]">Customer Care</h4>
          <ul className="space-y-2 text-xs font-sans font-light text-[#FAF9F6]/75">
            <li>
              <Link to="/faq" onClick={() => handleFooterLinkClick('FAQ')} className="hover:text-[#D4AF37] transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => handleFooterLinkClick('Contact')} className="hover:text-[#D4AF37] transition-colors">
                Contact Concierge
              </Link>
            </li>
            <li>
              <Link to="/privacy" onClick={() => handleFooterLinkClick('Privacy')} className="hover:text-[#D4AF37] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" onClick={() => handleFooterLinkClick('Terms')} className="hover:text-[#D4AF37] transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#D4AF37]">Join the Journal</h4>
          <p className="text-xs text-[#FAF9F6]/60 leading-relaxed font-sans font-light">
            Subscribe to receive advanced skincare research, private collections, and 15% off your first ritual order.
          </p>

          {subscribed ? (
            <div className="text-xs text-[#D4AF37] font-medium font-sans animate-fade-in">
              Welcome to AuraSkin. Thank you for subscribing.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center border-b border-white/20 pb-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-white/40 font-sans font-light"
                required
              />
              <button 
                type="submit" 
                className="text-[#FAF9F6] hover:text-[#D4AF37] transition-colors p-1"
                aria-label="Subscribe"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Copyright Footer Sub-section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#FAF9F6]/40 tracking-wider font-sans uppercase">
        <span>© {new Date().getFullYear()} AuraSkin Inc. All Rights Reserved.</span>
        <span className="mt-2 md:mt-0">Designed for Premium Skincare Commerce • GA4 Ready</span>
      </div>
    </footer>
  );
};
