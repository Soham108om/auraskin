import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Trigger GA4 login event
      trackEvent({
        name: 'login',
        params: { method: 'email' },
      });
      alert(`Welcome back to AuraSkin! Sign-in successful.`);
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Aura Partner Portal</span>
        <h1 className="text-3xl font-serif text-[#222222]">Sign In</h1>
        <p className="text-xs text-[#222222]/50 font-sans">Manage your routine subscription and favorites lists.</p>
      </div>

      <form onSubmit={handleLoginSubmit} className="bg-[#FFF8F2]/40 border border-[#E8DEC9]/30 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Email Address</label>
          <div className="flex items-center border border-[#E8DEC9] rounded-xl bg-[#FAF9F6] p-3 space-x-2">
            <Mail size={14} className="text-[#222222]/30" />
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full font-sans text-[#222222]"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Password</label>
          <div className="flex items-center border border-[#E8DEC9] rounded-xl bg-[#FAF9F6] p-3 space-x-2">
            <Lock size={14} className="text-[#222222]/30" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full font-sans text-[#222222]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
        >
          <span>Sign In</span>
          <ArrowRight size={12} />
        </button>
      </form>

      <div className="text-center text-xs text-[#222222]/60 font-sans">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#D4AF37] font-semibold hover:text-[#222222] transition-colors">
          Create one here
        </Link>
      </div>
    </div>
  );
};
