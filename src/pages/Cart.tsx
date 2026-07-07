import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { formatRupee, getProductPrice } from '../utils/currency';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    couponCode, 
    applyCoupon, 
    removeCoupon, 
    subtotal, 
    discountAmount, 
    shipping, 
    finalTotal 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = applyCoupon(couponInput);
      if (ok) {
        trackEvent({
          name: 'cta_click',
          params: { cta_label: `Apply Coupon Success - ${couponInput.trim().toUpperCase()}`, section_name: 'Cart Page' }
        });
        setCouponInput('');
      } else {
        alert("Invalid coupon code! Try AURAGLOW or WELCOME10.");
      }
    }
  };

  const handleBeginCheckout = () => {
    trackEvent({
      name: 'begin_checkout',
      params: {
        value: finalTotal,
        items_count: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      },
    });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Shopping Cart</span>
        <h1 className="text-4xl font-serif text-[#222222]">Your Skin Ritual Order</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="divide-y divide-[#E8DEC9]/30">
              {cartItems.map((item) => {
                const sizePrice = getProductPrice(item.product, item.selectedSize);
                const discountedPrice = sizePrice - (sizePrice * item.product.discount) / 100;
                return (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedScent}`} className="py-6 flex items-center space-x-6">
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-[#222222]/40 font-sans font-semibold">
                        {item.product.category}
                      </span>
                      <h4 className="text-sm font-serif text-[#222222] truncate">
                        <Link to={`/product/${item.product.id}`} className="hover:text-[#D4AF37] transition-colors">
                          {item.product.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#222222]/50 font-sans mt-0.5">
                        Volume: {item.selectedSize || item.product.size} | Blend: {item.selectedScent || "Signature Blend"}
                      </p>
                      
                      {/* Price tag */}
                      <div className="mt-2 text-xs flex items-center space-x-1.5">
                        {item.product.discount > 0 ? (
                          <>
                            <span className="line-through text-[#222222]/40">{formatRupee(sizePrice)}</span>
                            <span className="font-semibold text-[#D4AF37]">{formatRupee(discountedPrice)}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-[#222222]">{formatRupee(sizePrice)}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E8DEC9] rounded-full overflow-hidden scale-90">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedScent)}
                        className="px-3 py-1.5 hover:bg-[#F5EFE6] text-[#222222] transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-sans font-medium text-[#222222]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedScent)}
                        className="px-3 py-1.5 hover:bg-[#F5EFE6] text-[#222222] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedScent)}
                      className="p-2 text-[#222222]/40 hover:text-[#222222] transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Checkout / Summary box */}
          <div className="bg-[#FFF8F2]/50 border border-[#E8DEC9]/40 rounded-2xl p-6 h-fit space-y-6">
            <h3 className="text-lg font-serif text-[#222222] border-b border-[#E8DEC9]/30 pb-2">Order Summary</h3>

            <div className="space-y-3 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-[#222222]/60">Subtotal</span>
                <span className="font-medium text-[#222222]">{formatRupee(subtotal)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>Ritual Discount ({couponCode})</span>
                  <span>-{formatRupee(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#222222]/60">Shipping</span>
                <span className="font-medium text-[#222222]">
                  {shipping === 0 ? "Free" : formatRupee(shipping)}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#E8DEC9]/30 pt-4 text-sm font-semibold">
                <span className="text-[#222222]">Estimated Total</span>
                <span className="text-[#222222]">{formatRupee(finalTotal)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-[#E8DEC9]/30 space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 block font-semibold font-sans">Apply Promo Code</label>
              <div className="flex items-center border border-[#E8DEC9] rounded-xl overflow-hidden bg-[#FAF9F6] p-1">
                <input
                  type="text"
                  placeholder="e.g. AURAGLOW"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full px-2.5 py-1.5 font-sans placeholder-[#222222]/30 text-[#222222]"
                />
                <button
                  type="submit"
                  className="bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-[10px] uppercase tracking-widest font-semibold px-4 py-2.5 rounded-lg transition-all"
                >
                  Apply
                </button>
              </div>
              {couponCode && (
                <div className="flex items-center justify-between bg-[#FFF8F2] border border-[#D4AF37]/20 p-2 rounded-lg text-[10px]">
                  <span className="text-[#222222]/70 font-sans">Active Code: <strong className="text-[#D4AF37]">{couponCode}</strong></span>
                  <button type="button" onClick={removeCoupon} className="text-[#222222]/40 hover:text-red-700 font-sans uppercase font-bold text-[8px] tracking-wider">
                    Remove
                  </button>
                </div>
              )}
            </form>

            <button
              onClick={handleBeginCheckout}
              className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 space-y-4">
          <ShoppingCart size={36} className="mx-auto text-[#222222]/30" />
          <h3 className="text-xl font-serif text-[#222222]">Your cart is empty</h3>
          <p className="text-xs text-[#222222]/60 font-sans max-w-xs mx-auto">
            Ready to build your slow skincare routine? Shop our premium collections to begin.
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-[#222222] text-[#FAF9F6] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold"
          >
            Go to Shop
          </Link>
        </div>
      )}
    </div>
  );
};
