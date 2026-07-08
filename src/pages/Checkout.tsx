import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { formatRupee, getProductPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { PaymentGateway } from '../components/PaymentGateway';
import { supabase } from '../utils/supabase';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, finalTotal, subtotal, discountAmount, shipping, couponCode, clearCart } = useCart();
  const { user, profile, isDemoMode } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  
  // Payment states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Pre-populate details from profile if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setZip(profile.zip || '');
    }
  }, [user, profile]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-xl font-serif text-[#222222]">Cart is empty</h2>
        <p className="text-xs text-[#222222]/60 font-sans">You cannot checkout with an empty bag.</p>
        <button onClick={() => navigate('/shop')} className="inline-block bg-[#222222] text-[#FAF9F6] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full">
          Return to Shop
        </button>
      </div>
    );
  }

  // Triggered when form validates - opens the sandbox payment gateway modal
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName && address && city && zip) {
      setIsPaymentOpen(true);
    }
  };

  // Called when transaction successfully processes in PaymentGateway
  const handlePaymentSuccess = async (paymentMethod: string, transactionId: string) => {
    setIsPaymentOpen(false);
    setSavingOrder(true);

    try {
      if (isDemoMode) {
        // Sandboxed mock order storage
        const mockOrder = {
          id: transactionId,
          created_at: new Date().toISOString(),
          subtotal,
          discount_amount: discountAmount,
          shipping,
          final_total: finalTotal,
          payment_status: 'Paid',
          payment_method: paymentMethod,
          address,
          city,
          zip,
          order_items: cartItems.map((item, index) => {
            const sizePrice = getProductPrice(item.product, item.selectedSize);
            const itemPrice = sizePrice - (sizePrice * item.product.discount) / 100;
            return {
              id: index + 1,
              product_id: item.product.id,
              product_name: item.product.name,
              quantity: item.quantity,
              price: itemPrice,
              selected_size: item.selectedSize || item.product.size,
              selected_scent: item.selectedScent || "Signature Blend"
            };
          })
        };

        const savedOrdersStr = localStorage.getItem('auraskin_mock_orders');
        const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
        savedOrders.unshift(mockOrder);
        localStorage.setItem('auraskin_mock_orders', JSON.stringify(savedOrders));
      } else if (supabase) {
        // Save Order to Supabase Database
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            id: transactionId,
            user_id: user?.id || null,
            email,
            first_name: firstName,
            last_name: lastName,
            address,
            city,
            zip,
            subtotal,
            discount_amount: discountAmount,
            shipping,
            final_total: finalTotal,
            coupon_code: couponCode || null,
            payment_status: 'Paid',
            payment_method: paymentMethod,
            transaction_id: transactionId,
          });

        if (orderError) throw orderError;

        // Save line items
        const orderItemsInsert = cartItems.map(item => {
          const sizePrice = getProductPrice(item.product, item.selectedSize);
          const itemPrice = sizePrice - (sizePrice * item.product.discount) / 100;
          return {
            order_id: transactionId,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            price: itemPrice,
            selected_size: item.selectedSize || item.product.size,
            selected_scent: item.selectedScent || "Signature Blend"
          };
        });

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsInsert);

        if (itemsError) throw itemsError;
      }

      // Track purchase event in analytics
      trackEvent({
        name: 'purchase',
        params: {
          transaction_id: transactionId,
          value: finalTotal,
          tax: Number((finalTotal * 0.08).toFixed(2)),
          shipping,
          coupon: couponCode || undefined,
        },
      });

      clearCart();
      navigate(`/order-success?orderId=${transactionId}&total=${finalTotal}&name=${encodeURIComponent(firstName)}`);
    } catch (err: any) {
      alert(`Error storing order: ${err.message || 'Please try again.'}`);
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12 animate-fade-in">
      <h1 className="text-3xl font-serif text-[#222222] text-center border-b border-[#E8DEC9]/20 pb-4">Secure Skincare Ritual Checkout</h1>

      {savingOrder ? (
        <div className="py-24 text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <h3 className="text-sm font-serif font-semibold text-[#222222]">Securing Skincare Order...</h3>
          <p className="text-xs text-[#222222]/50 font-sans">Syncing order details with server and preparing lab dispatch log...</p>
        </div>
      ) : (
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left/Middle Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-[#222222]">Shipping Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 88888"
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Zip/Postal Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="bg-[#FFF8F2]/50 border border-[#E8DEC9]/40 rounded-2xl p-6 h-fit space-y-6">
            <h3 className="text-lg font-serif text-[#222222] border-b border-[#E8DEC9]/30 pb-2">Review Items</h3>
            
            <div className="divide-y divide-[#E8DEC9]/20 max-h-60 overflow-y-auto">
              {cartItems.map((item) => {
                const sizePrice = getProductPrice(item.product, item.selectedSize);
                const discountedPrice = sizePrice - (sizePrice * item.product.discount) / 100;
                return (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedScent}`} className="py-3 flex items-center justify-between text-xs font-sans">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-serif text-[#222222] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-[#222222]/50">
                        Qty: {item.quantity} | Vol: {item.selectedSize || item.product.size} | Blend: {item.selectedScent || "Signature"}
                      </p>
                    </div>
                    <span className="font-medium text-[#222222]">
                      {formatRupee(discountedPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 text-xs font-sans border-t border-[#E8DEC9]/30 pt-4">
              <div className="flex justify-between">
                <span className="text-[#222222]/60">Subtotal</span>
                <span className="font-medium text-[#222222]">{formatRupee(subtotal)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>Discount</span>
                  <span>-{formatRupee(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#222222]/60">Shipping</span>
                <span className="font-medium text-[#222222]">
                  {shipping === 0 ? "Free" : formatRupee(shipping)}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#E8DEC9]/30 pt-3 text-sm font-semibold">
                <span className="text-[#222222]">Total</span>
                <span className="text-[#222222]">{formatRupee(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <span>Proceed to Payment</span>
              <ArrowRight size={13} />
            </button>

            <div className="text-[10px] text-[#222222]/50 font-sans flex items-center justify-center space-x-2">
              <ShieldCheck size={12} className="text-[#D4AF37]" />
              <span>Encrypted payment connection</span>
            </div>
          </div>
        </form>
      )}

      {/* Reusable Payment Gateway Sandbox Drawer */}
      <PaymentGateway
        amount={finalTotal}
        isOpen={isPaymentOpen}
        onCancel={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
