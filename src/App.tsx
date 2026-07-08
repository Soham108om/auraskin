import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GAHelper } from './components/GAHelper';
import { QuickView } from './components/QuickView';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { SkinQuizPage } from './pages/SkinQuizPage';
import { RoutineBuilderPage } from './pages/RoutineBuilderPage';
import { BestSellers } from './pages/BestSellers';
import { NewArrivals } from './pages/NewArrivals';
import { Offers } from './pages/Offers';
import { Blog } from './pages/Blog';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';

import { AuthProvider } from './context/AuthContext';

import { Product } from './types';
import { MessageSquare, X, Send, ShoppingBag } from 'lucide-react';
import { trackEvent } from './utils/analytics';

export const AppContent: React.FC = () => {
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Chat Concierge State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Welcome to AuraSkin Concierge. How can I assist you with your routine today?' }
  ]);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const userText = chatMessage.trim();
      setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
      setChatMessage('');

      trackEvent({
        name: 'cta_click',
        params: { cta_label: `Chat Send - ${userText.slice(0, 20)}`, section_name: 'Chat Concierge' }
      });

      // Simple response
      setTimeout(() => {
        let reply = "I would be happy to guide you! We highly recommend taking our 2-minute Skin Quiz to get a customized routine.";
        if (userText.toLowerCase().includes('oily')) {
          reply = "For oily skin, our Niacinamide-10 Pore Refiner serum combined with the Matcha Detoxifying Clay Mask is a highly praised pairing.";
        } else if (userText.toLowerCase().includes('dry')) {
          reply = "For dry skin, we recommend the Ceramide-Barrier Rich Cream to lock in moisture and the Squalane & Rose Gold Facial Oil.";
        } else if (userText.toLowerCase().includes('coupon') || userText.toLowerCase().includes('discount')) {
          reply = "You can use the promo code AURAGLOW at checkout to enjoy 15% off site-wide!";
        }

        setChatLog(prev => [...prev, { sender: 'bot', text: reply }]);
      }, 800);
    }
  };

  return (
    <Router>
      <GAHelper />
      <div className="flex flex-col min-h-screen relative bg-[#FAF9F6] text-[#222222]">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onQuickView={handleQuickView} />} />
            <Route path="/shop" element={<Shop onQuickView={handleQuickView} />} />
            <Route path="/product/:id" element={<ProductDetails onQuickView={handleQuickView} />} />
            <Route path="/skin-quiz" element={<SkinQuizPage />} />
            <Route path="/routine-builder" element={<RoutineBuilderPage />} />
            <Route path="/best-sellers" element={<BestSellers onQuickView={handleQuickView} />} />
            <Route path="/new-arrivals" element={<NewArrivals onQuickView={handleQuickView} />} />
            <Route path="/offers" element={<Offers onQuickView={handleQuickView} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/wishlist" element={<Wishlist onQuickView={handleQuickView} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
          </Routes>
        </main>

        <Footer />

        {/* Quick View Drawer Wrapper */}
        <QuickView 
          product={quickViewProduct} 
          isOpen={quickViewOpen} 
          onClose={handleCloseQuickView} 
        />

        {/* Floating Chat / Skin Concierge Widget */}
        <div className="fixed bottom-6 right-6 z-35 flex flex-col items-end space-y-4">
          {chatOpen && (
            <div className="w-80 h-96 bg-[#FAF9F6] border border-[#E8DEC9] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
              {/* Chat Title bar */}
              <div className="bg-[#222222] text-[#FAF9F6] p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold font-sans">Skin Concierge</h4>
                  <span className="text-[9px] text-[#D4AF37] font-sans">Online • Expert Guidance</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Chat Messages Logs */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs font-sans">
                {chatLog.map((chat, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl max-w-[80%] ${
                      chat.sender === 'bot' 
                        ? 'bg-[#F5EFE6] text-[#222222] self-start mr-auto'
                        : 'bg-[#D4AF37] text-white self-end ml-auto'
                    }`}
                  >
                    {chat.text}
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} className="border-t border-[#E8DEC9]/30 p-2 flex items-center bg-[#FAF9F6]">
                <input 
                  type="text" 
                  placeholder="Ask skin concierge..." 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs px-2 py-1.5 font-sans"
                />
                <button type="submit" className="p-1.5 text-[#D4AF37] hover:text-[#222222] transition-colors">
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              trackEvent({ name: 'cta_click', params: { cta_label: 'Toggle Chat Concierge', section_name: 'Floating Elements' } });
            }}
            className="p-4 bg-[#D4AF37] hover:bg-[#222222] text-white rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
            title="Talk to Skin Concierge"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};
