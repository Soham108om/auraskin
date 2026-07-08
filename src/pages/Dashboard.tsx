import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Award, Sparkles, MapPin, Phone, LogOut, ChevronDown, ChevronUp, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { formatRupee } from '../utils/currency';

interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  selected_size: string;
  selected_scent: string;
}

interface Order {
  id: string;
  created_at: string;
  subtotal: number;
  discount_amount: number;
  shipping: number;
  final_total: number;
  payment_status: string;
  payment_method: string;
  address: string;
  city: string;
  zip: string;
  order_items?: OrderItem[];
}

interface QuizResult {
  id: string;
  created_at: string;
  skin_type: string;
  concern: string;
  sensitivity: string;
  hydration: number;
  sebum: number;
  barrier: number;
}

export const Dashboard: React.FC = () => {
  const { user, profile, signOut, updateProfile, isDemoMode, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'quiz'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  
  // Profile edit states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Sync profile details to form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setZip(profile.zip || '');
    }
  }, [profile]);

  // Fetch orders and quiz history
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      if (isDemoMode) {
        // Load mock orders
        const savedMockOrders = localStorage.getItem('auraskin_mock_orders');
        if (savedMockOrders) {
          setOrders(JSON.parse(savedMockOrders));
        } else {
          // Default empty or mock order
          const mockOrder: Order = {
            id: 'T-108249',
            created_at: new Date().toISOString(),
            subtotal: 1850.0,
            discount_amount: 277.5,
            shipping: 0.0,
            final_total: 1572.5,
            payment_status: 'Paid',
            payment_method: 'Credit Card',
            address: '42, Golden Crest Apartments, Bandra West',
            city: 'Mumbai',
            zip: '400050',
            order_items: [
              {
                id: 1,
                product_id: 'p3',
                product_name: 'Niacinamide-10 Pore Refiner Serum',
                quantity: 1,
                price: 1850.0,
                selected_size: '30ml',
                selected_scent: 'Signature Blend'
              }
            ]
          };
          setOrders([mockOrder]);
        }
        setOrdersLoading(false);
        return;
      }

      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchQuizHistory = async () => {
      setQuizLoading(true);
      if (isDemoMode) {
        const savedMockQuiz = localStorage.getItem('auraskin_mock_quiz');
        if (savedMockQuiz) {
          setQuizHistory([JSON.parse(savedMockQuiz)]);
        } else {
          setQuizHistory([
            {
              id: 'q-1',
              created_at: new Date().toISOString(),
              skin_type: 'Combination',
              concern: 'Acne',
              sensitivity: 'Sensitive',
              hydration: 65,
              sebum: 55,
              barrier: 45
            }
          ]);
        }
        setQuizLoading(false);
        return;
      }

      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setQuizHistory(data || []);
      } catch (err: any) {
        console.error('Error fetching quiz results:', err.message);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchOrders();
    fetchQuizHistory();
  }, [user, isDemoMode]);

  // Handle redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    const res = await updateProfile({
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
      city,
      zip,
    });

    setSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res.error || 'Failed to update profile.');
    }
  };

  const handleSignOutClick = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
        <p className="text-xs text-[#222222]/60 font-sans">Retrieving your skin ritual portal...</p>
      </div>
    );
  }

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12 animate-fade-in">
      {/* Header Profile Summary */}
      <div className="bg-[#FFF8F2]/50 border border-[#E8DEC9]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#222222] text-[#FAF9F6] font-serif rounded-full flex items-center justify-center text-xl font-semibold shadow-md">
            {firstName ? firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}
            {lastName ? lastName[0].toUpperCase() : ''}
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl font-serif text-[#222222]">
              Welcome, {firstName || 'Aura Circle Partner'}
            </h1>
            <p className="text-xs text-[#222222]/50 font-sans flex items-center justify-center md:justify-start">
              <span>{user.email}</span>
              {isDemoMode && (
                <span className="ml-2 bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Demo Sandbox
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOutClick}
          className="flex items-center space-x-2 border border-[#E8DEC9] hover:bg-red-50 hover:border-red-200 text-[#222222]/70 hover:text-red-600 font-sans text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded-full transition-all duration-300"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Panel tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-sans font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#222222] text-white shadow-md'
                : 'text-[#222222]/75 hover:bg-[#FFF8F2]/60 hover:text-[#222222]'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Order History</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-sans font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#222222] text-white shadow-md'
                : 'text-[#222222]/75 hover:bg-[#FFF8F2]/60 hover:text-[#222222]'
            }`}
          >
            <User size={14} />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-sans font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#222222] text-white shadow-md'
                : 'text-[#222222]/75 hover:bg-[#FFF8F2]/60 hover:text-[#222222]'
            }`}
          >
            <Sparkles size={14} />
            <span>Skin Intelligence</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3 bg-white border border-[#E8DEC9]/20 rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Tab 1: Orders History */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8DEC9]/20 pb-4">
                <h2 className="text-xl font-serif text-[#222222]">Order History</h2>
                <p className="text-xs text-[#222222]/50 font-sans">Review transaction receipts and laboratory preparation progress.</p>
              </div>

              {ordersLoading ? (
                <div className="py-12 text-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37] mx-auto"></div>
                  <span className="text-[10px] text-[#222222]/50 font-sans">Connecting to shipping records...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-[#FFF8F2] text-[#222222]/30 flex items-center justify-center rounded-full">
                    <ShoppingBag size={20} />
                  </div>
                  <h3 className="text-sm font-serif font-semibold text-[#222222]">No Rituals Placed Yet</h3>
                  <p className="text-xs text-[#222222]/50 font-sans max-w-xs mx-auto">
                    Your collection log is empty. Visit the skincare library to curate your bespoke formulations.
                  </p>
                  <button onClick={() => navigate('/shop')} className="bg-[#222222] text-[#FAF9F6] text-[10px] uppercase tracking-widest font-semibold px-5 py-2.5 rounded-full hover:bg-[#222222]/90 transition-all">
                    Browse Apothecary
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });

                    return (
                      <div key={order.id} className="border border-[#E8DEC9]/35 rounded-2xl overflow-hidden font-sans text-xs">
                        {/* Summary Header */}
                        <div
                          onClick={() => toggleOrder(order.id)}
                          className="bg-[#FFF8F2]/30 p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-[#FFF8F2]/60 transition-colors"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-[#222222]/50">Order Date</p>
                              <p className="font-medium text-[#222222] mt-0.5">{orderDate}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-[#222222]/50">Reference</p>
                              <p className="font-mono font-medium text-[#222222] mt-0.5">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-[#222222]/50">Total Amount</p>
                              <p className="font-semibold text-[#D4AF37] mt-0.5">{formatRupee(order.final_total)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-[#222222]/50">Status</p>
                              <span className={`inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                order.payment_status === 'Paid'
                                  ? 'bg-green-100 text-green-700'
                                  : order.payment_status === 'Failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.payment_status}
                              </span>
                            </div>
                          </div>
                          <div className="pl-4 text-[#222222]/40">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Detailed Dropdown */}
                        {isExpanded && (
                          <div className="p-5 border-t border-[#E8DEC9]/20 divide-y divide-[#E8DEC9]/15">
                            {/* Items List */}
                            <div className="pb-4 space-y-3">
                              <h4 className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-bold">Line Items</h4>
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-1">
                                  <div>
                                    <p className="font-serif font-semibold text-[#222222]">{item.product_name}</p>
                                    <p className="text-[10px] text-[#222222]/50 mt-0.5">
                                      Qty: {item.quantity} | Size: {item.selected_size} | Blend: {item.selected_scent}
                                    </p>
                                  </div>
                                  <span className="font-medium text-[#222222]">{formatRupee(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Details & Payment Breakdown */}
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#222222]/80">
                              <div className="space-y-1.5">
                                <h4 className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-bold mb-1 flex items-center">
                                  <MapPin size={11} className="mr-1 text-[#D4AF37]" />
                                  <span>Delivery Destination</span>
                                </h4>
                                <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                                <p className="font-light">{order.address}</p>
                                <p className="font-light">{order.city} - {order.zip}</p>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-bold mb-1">Receipt Summary</h4>
                                <div className="space-y-1 font-light">
                                  <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatRupee(order.subtotal)}</span>
                                  </div>
                                  {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-[#D4AF37]">
                                      <span>Applied Discount</span>
                                      <span>-{formatRupee(order.discount_amount)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span>Shipping Concierge</span>
                                    <span>{order.shipping === 0 ? "Free" : formatRupee(order.shipping)}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between border-t border-[#E8DEC9]/30 pt-2 font-semibold text-[#222222]">
                                  <span>Total Paid</span>
                                  <span className="text-[#D4AF37]">{formatRupee(order.final_total)}</span>
                                </div>
                                <p className="text-[9px] text-[#222222]/40 italic text-right">Paid via {order.payment_method}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8DEC9]/20 pb-4">
                <h2 className="text-xl font-serif text-[#222222]">Profile Details</h2>
                <p className="text-xs text-[#222222]/50 font-sans">Manage your delivery destination and security contacts.</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 font-sans">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    <span>Aura profile metadata updated successfully.</span>
                  </div>
                )}

                {saveError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-sans">
                    {saveError}
                  </div>
                )}

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

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold flex items-center">
                    <Phone size={10} className="mr-1" /> Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 88888"
                    className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E8DEC9]/15">
                  <h3 className="text-xs uppercase tracking-wider text-[#222222]/60 font-sans font-bold flex items-center">
                    <MapPin size={12} className="mr-1 text-[#D4AF37]" />
                    <span>Default Skincare Delivery Destination</span>
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, House No., Building, Street Name"
                      className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Zip / Postal Code</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="e.g. 400050"
                        className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-[#222222] hover:bg-[#222222]/90 disabled:bg-[#222222]/50 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-8 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
                >
                  <Save size={13} />
                  <span>{saving ? 'Saving...' : 'Save Profile Details'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Skin Intelligence & Quiz history */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8DEC9]/20 pb-4">
                <h2 className="text-xl font-serif text-[#222222]">Skin Intelligence History</h2>
                <p className="text-xs text-[#222222]/50 font-sans">Access diagnostics reports from your molecular skin analyses.</p>
              </div>

              {quizLoading ? (
                <div className="py-12 text-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37] mx-auto"></div>
                  <span className="text-[10px] text-[#222222]/50 font-sans">Connecting to diagnostics logs...</span>
                </div>
              ) : quizHistory.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-[#FFF8F2] text-[#D4AF37] flex items-center justify-center rounded-full">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-sm font-serif font-semibold text-[#222222]">No Diagnostics Done</h3>
                  <p className="text-xs text-[#222222]/50 font-sans max-w-xs mx-auto">
                    Take our Skin Quiz to align your products with your skin's biological parameters.
                  </p>
                  <button onClick={() => navigate('/skin-quiz')} className="bg-[#222222] text-[#FAF9F6] text-[10px] uppercase tracking-widest font-semibold px-5 py-2.5 rounded-full hover:bg-[#222222]/90 transition-all">
                    Start Skin Analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {quizHistory.map((report) => {
                    const quizDate = new Date(report.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    
                    return (
                      <div key={report.id} className="border border-[#E8DEC9]/30 rounded-2xl p-5 space-y-4 font-sans text-xs">
                        <div className="flex justify-between items-center border-b border-[#E8DEC9]/15 pb-2">
                          <span className="font-serif font-semibold text-sm text-[#222222]">
                            Report: {report.skin_type} Skin System
                          </span>
                          <span className="text-[9px] text-[#222222]/40 italic">{quizDate}</span>
                        </div>

                        {/* Parameters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <div className="flex justify-between mb-1 font-medium text-[#222222]">
                              <span>Hydration</span>
                              <span className="text-[#D4AF37] font-semibold">{report.hydration}%</span>
                            </div>
                            <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#E8DEC9]/20">
                              <div className="h-full bg-[#D4AF37]" style={{ width: `${report.hydration}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 font-medium text-[#222222]">
                              <span>Sebum Control</span>
                              <span className="text-[#D4AF37] font-semibold">{report.sebum}%</span>
                            </div>
                            <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#E8DEC9]/20">
                              <div className="h-full bg-[#D4AF37]" style={{ width: `${report.sebum}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 font-medium text-[#222222]">
                              <span>Barrier Strength</span>
                              <span className="text-[#D4AF37] font-semibold">{report.barrier}%</span>
                            </div>
                            <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#E8DEC9]/20">
                              <div className="h-full bg-[#D4AF37]" style={{ width: `${report.barrier}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Summary details */}
                        <div className="bg-[#FFF8F2]/40 rounded-xl p-3 border border-[#E8DEC9]/15 text-[10px] text-[#222222]/70 leading-relaxed font-sans">
                          <strong>Diagnostic Insights</strong>: Recommending a customized ritual addressing <strong>{report.concern}</strong> concerns, optimizing hydration balance, and reinforcing lipids for <strong>{report.sensitivity}</strong> skin types.
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => navigate('/skin-quiz')}
                      className="border border-[#E8DEC9] hover:bg-[#FFF8F2]/60 text-[#222222]/70 hover:text-[#222222] text-[10px] uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full transition-all"
                    >
                      Retake Skin Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
