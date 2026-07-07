// Google Analytics 4 & GTM Event Tracker for AuraSkin
// Prepared for College Digital Marketing & Web Analytics Projects

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export type AnalyticsEvent = 
  | { name: 'page_view'; params: { page_title: string; page_path: string } }
  | { name: 'view_item'; params: { item_id: string; item_name: string; price: number; category: string } }
  | { name: 'search'; params: { search_term: string } }
  | { name: 'add_to_cart'; params: { item_id: string; item_name: string; price: number; quantity: number } }
  | { name: 'remove_from_cart'; params: { item_id: string; item_name: string; price: number } }
  | { name: 'add_to_wishlist'; params: { item_id: string; item_name: string; price: number } }
  | { name: 'begin_checkout'; params: { value: number; items_count: number } }
  | { name: 'purchase'; params: { transaction_id: string; value: number; tax: number; shipping: number; coupon?: string } }
  | { name: 'newsletter_signup'; params: { email: string } }
  | { name: 'contact_submit'; params: { name: string; email: string; subject: string } }
  | { name: 'login'; params: { method: string } }
  | { name: 'register'; params: { method: string } }
  | { name: 'scroll_depth'; params: { depth: '25%' | '50%' | '75%' | '100%' } }
  | { name: 'cta_click'; params: { cta_label: string; section_name: string } }
  | { name: 'banner_click'; params: { banner_id: string; destination_url: string } }
  | { name: 'category_click'; params: { category_name: string } };

export const trackEvent = (event: AnalyticsEvent) => {
  // 1. Send to window.dataLayer for Google Tag Manager
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: event.name,
      ecommerce: event.name === 'purchase' || event.name === 'view_item' || event.name === 'add_to_cart' || event.name === 'remove_from_cart'
        ? { value: (event.params as any).value || (event.params as any).price, items: [event.params] }
        : undefined,
      ...event.params,
    });

    // 2. Call standard gtag if defined
    if (typeof window.gtag === 'function') {
      window.gtag('event', event.name, event.params);
    }
  }

  // 3. Premium console logging for visual class demonstrations and debugging
  console.log(
    `%c[GA4 & GTM TRACKER]%c Event: %c${event.name}%c | Data:`,
    "color: #D4AF37; font-weight: bold; background: #222222; padding: 2px 6px; border-radius: 3px;",
    "color: #222222; font-weight: bold;",
    "color: #008080; font-weight: bold; text-decoration: underline;",
    "color: #222222;",
    event.params
  );
};
