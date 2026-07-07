import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, ShoppingBag } from 'lucide-react';
import { formatRupee } from '../utils/currency';

export const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'T-987654';
  const total = Number(searchParams.get('total') || '0').toFixed(2);
  const name = searchParams.get('name') || 'Guest';

  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-8 animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-[#FFF8F2] text-[#D4AF37] flex items-center justify-center rounded-full">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Thank you, {name}</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#222222]">Ritual Order Placed</h1>
        <p className="text-xs text-[#222222]/60 font-sans max-w-sm mx-auto">
          Your skincare formulations are being prepared by our laboratory concierge. An confirmation email with shipping details has been sent.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-[#FFF8F2]/60 border border-[#E8DEC9]/30 rounded-2xl p-6 text-left space-y-4 font-sans text-xs text-[#222222]">
        <div className="flex justify-between items-center border-b border-[#E8DEC9]/20 pb-3">
          <span className="text-[#222222]/60 uppercase tracking-wider">Order Reference</span>
          <span className="font-semibold">{orderId}</span>
        </div>
        <div className="flex justify-between items-center border-b border-[#E8DEC9]/20 pb-3">
          <span className="text-[#222222]/60 uppercase tracking-wider">Estimated Delivery</span>
          <span className="font-semibold flex items-center"><Calendar size={12} className="mr-1" /> 3–5 Business Days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#222222]/60 uppercase tracking-wider">Amount Transacted</span>
          <span className="font-semibold text-sm text-[#D4AF37]">{formatRupee(Number(total))}</span>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/shop" 
          className="w-full sm:w-auto bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-8 rounded-full transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <ShoppingBag size={13} />
          <span>Return to Shop</span>
        </Link>
        <Link 
          to="/"
          className="w-full sm:w-auto border border-[#E8DEC9] hover:bg-[#F5EFE6] text-[#222222]/70 hover:text-[#222222] font-sans text-xs uppercase tracking-[0.15em] py-3.5 px-8 rounded-full transition-all text-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
