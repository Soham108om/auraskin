import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, profile, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (dropdownOpen && !target.closest('.profile-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      trackEvent({
        name: 'search',
        params: { search_term: searchTerm.trim() },
      });
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleNavClick = (label: string, path: string) => {
    trackEvent({
      name: 'cta_click',
      params: { cta_label: `Nav - ${label}`, section_name: 'Navbar' },
    });
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Skin Quiz', path: '/skin-quiz' },
    { label: 'Routine Builder', path: '/routine-builder' },
    { label: 'The Journal', path: '/blog' },
    { label: 'About Us', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Promotional Top Bar */}
      <div className="bg-[#222222] text-[#FFF8F2] text-[10px] tracking-[0.25em] py-2 px-4 text-center font-sans uppercase font-medium flex items-center justify-center space-x-1.5 md:space-x-4">
        <span>Complimentary Shipping on Orders Over ₹1,500</span>
        <span className="hidden md:inline text-[#D4AF37]">•</span>
        <span>Use Code <strong className="text-[#D4AF37]">AURAGLOW</strong> for 15% Off</span>
      </div>

      {/* Main Navbar */}
      <nav className="glass border-b border-[#E8DEC9]/20 py-4 px-6 md:px-12 flex items-center justify-between z-20 relative">
        {/* Left: Hamburger (Mobile) & Brand Nav Links (Desktop) */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#222222] hover:text-[#D4AF37] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.slice(1, 4).map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                onClick={() => handleNavClick(item.label, item.path)}
                className={`text-xs uppercase tracking-[0.2em] font-sans font-semibold transition-all duration-300 hover:text-[#D4AF37] ${
                  location.pathname === item.path ? 'text-[#D4AF37]' : 'text-[#222222]/70'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center: Brand Identity Logo */}
        <div className="text-center absolute left-1/2 transform -translate-x-1/2">
          <Link 
            to="/" 
            onClick={() => handleNavClick('Home', '/')}
            className="text-xl md:text-2xl font-serif tracking-[0.3em] font-bold text-[#222222] hover:text-[#D4AF37] transition-colors duration-300 block"
          >
            AURA<span className="text-[#D4AF37]">SKIN</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 md:space-x-6 text-[#222222]/80">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:text-[#D4AF37] transition-all hover:scale-105 active:scale-95"
            title="Search Products"
          >
            <Search size={18} />
          </button>
          
          <Link 
            to="/wishlist" 
            onClick={() => handleNavClick('Wishlist', '/wishlist')}
            className="relative hover:text-[#D4AF37] transition-all hover:scale-105 active:scale-95"
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-white text-[8px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link 
            to="/cart" 
            onClick={() => handleNavClick('Cart', '/cart')}
            className="relative hover:text-[#D4AF37] transition-all hover:scale-105 active:scale-95"
            title="Shopping Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#222222] text-[#FAF9F6] text-[8px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 hover:text-[#D4AF37] transition-all focus:outline-none"
                title="Account Settings"
              >
                <div className="w-7 h-7 bg-[#222222] text-[#FAF9F6] text-[10px] font-semibold font-serif rounded-full flex items-center justify-center border border-[#E8DEC9]/35">
                  {profile?.first_name ? profile.first_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-[#FAF9F6] border border-[#E8DEC9]/40 rounded-2xl shadow-xl py-2 z-50 animate-fade-in font-sans text-xs">
                  <div className="px-4 py-2 border-b border-[#E8DEC9]/20 text-[#222222]/50 truncate">
                    Hi, {profile?.first_name || 'Partner'}
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleNavClick('Dashboard', '/dashboard');
                    }}
                    className="block px-4 py-2 text-[#222222] hover:bg-[#FFF8F2] hover:text-[#D4AF37] transition-colors font-medium"
                  >
                    My Portal
                  </Link>
                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      await signOut();
                      navigate('/');
                    }}
                    className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => handleNavClick('Login', '/login')}
              className="hover:text-[#D4AF37] transition-all hover:scale-105 active:scale-95"
              title="Login"
            >
              <User size={18} />
            </Link>
          )}
        </div>
      </nav>

      {/* Slide-Down Search Overlay */}
      {searchOpen && (
        <div className="absolute top-[88px] left-0 w-full bg-[#FAF9F6] border-b border-[#E8DEC9]/30 shadow-md py-4 px-6 md:px-12 flex items-center z-30 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center space-x-4">
            <Search size={16} className="text-[#222222]/50" />
            <input 
              type="text" 
              placeholder="Search by ingredient, skin concern, or product type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-sans font-light placeholder-[#222222]/40 text-[#222222]"
              autoFocus
            />
            <button 
              type="button" 
              onClick={() => setSearchOpen(false)}
              className="text-xs uppercase tracking-wider text-[#222222]/60 hover:text-[#222222] transition-colors"
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-20 bg-[#FAF9F6] flex flex-col md:hidden animate-fade-in border-t border-[#E8DEC9]/20">
          <div className="p-8 space-y-6 flex-1">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                onClick={() => handleNavClick(item.label, item.path)}
                className="block text-lg font-serif text-[#222222] hover:text-[#D4AF37] transition-colors border-b border-[#E8DEC9]/10 pb-3"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="p-8 border-t border-[#E8DEC9]/20 bg-[#FFF8F2]/50 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">AURA skin consultation</span>
            <p className="text-xs text-[#222222]/75 leading-relaxed font-sans">
              Not sure where to start? Take our 2-minute diagnostic skin quiz to build your custom ritual.
            </p>
            <Link 
              to="/skin-quiz"
              onClick={() => handleNavClick('Skin Quiz Callout', '/skin-quiz')}
              className="inline-flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-[#222222] hover:text-[#D4AF37] transition-colors"
            >
              <span>Start Skin Analysis</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
