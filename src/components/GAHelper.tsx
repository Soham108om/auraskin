import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

export const GAHelper: React.FC = () => {
  const location = useLocation();
  const trackedDepths = useRef<{ [key: string]: boolean }>({});

  // Track Page Views
  useEffect(() => {
    // Standard SEO titles based on path
    let title = "AuraSkin | Premium Luxury Skincare";
    const path = location.pathname;

    if (path === '/') title = "AuraSkin | Home of Luxury Skincare";
    else if (path.startsWith('/shop')) title = "Shop AuraSkin | Premium Skincare Rituals";
    else if (path.startsWith('/product/')) title = "AuraSkin Product Details";
    else if (path === '/skin-quiz') title = "AuraSkin Quiz | Discover Your Skin Type";
    else if (path === '/routine-builder') title = "AuraSkin Routine Builder | AM/PM Skincare System";
    else if (path === '/about') title = "About AuraSkin | Our Slow Skincare Philosophy";
    else if (path === '/blog') title = "The Aura Journal | Skincare Insights & Science";
    else if (path === '/cart') title = "Your Shopping Cart | AuraSkin";
    else if (path === '/checkout') title = "Secure Checkout | AuraSkin";
    else if (path === '/order-success') title = "Order Complete | Thank You | AuraSkin";
    else if (path === '/faq') title = "Frequently Asked Questions | AuraSkin Support";
    else if (path === '/contact') title = "Contact Our Skin Concierge | AuraSkin";
    else if (path === '/login') title = "Sign In | AuraSkin Partner Portal";
    else if (path === '/register') title = "Create an Account | AuraSkin Rituals";
    else if (path === '/wishlist') title = "Your Skincare Wishlist | AuraSkin";

    document.title = title;

    trackEvent({
      name: 'page_view',
      params: {
        page_title: title,
        page_path: path,
      },
    });

    // Reset tracked depths for new page
    trackedDepths.current = {};
    window.scrollTo(0, 0);
  }, [location]);

  // Track Scroll Depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      const depths: ('25%' | '50%' | '75%' | '100%')[] = ['25%', '50%', '75%', '100%'];
      const targetPercentages = [25, 50, 75, 95];

      targetPercentages.forEach((percentage, index) => {
        const depthKey = depths[index];
        if (scrollPercentage >= percentage && !trackedDepths.current[depthKey]) {
          trackedDepths.current[depthKey] = true;
          trackEvent({
            name: 'scroll_depth',
            params: { depth: depthKey },
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return null;
};
