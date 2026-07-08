import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Smartphone, Landmark, ShieldCheck, X, Loader2, KeyRound, AlertCircle } from 'lucide-react';
import { formatRupee } from '../utils/currency';

interface PaymentGatewayProps {
  amount: number;
  isOpen: boolean;
  onSuccess: (paymentMethod: string, transactionId: string) => void;
  onCancel: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, isOpen, onSuccess, onCancel }) => {
  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // UPI states
  const [upiId, setUpiId] = useState('');
  const [upiProcessing, setUpiProcessing] = useState(false);
  
  // Net banking state
  const [selectedBank, setSelectedBank] = useState('');

  const intervalRef = useRef<number | null>(null);

  // OTP Timer countdown
  useEffect(() => {
    if (showOtp && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOtp, otpTimer]);

  if (!isOpen) return null;

  // Formatting Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const matches = rawVal.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(rawVal.substring(0, 19));
    }
  };

  // Formatting Card Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length <= 2) {
      setCardExpiry(rawVal);
    } else {
      setCardExpiry(`${rawVal.slice(0, 2)}/${rawVal.slice(2, 4)}`);
    }
  };

  // Submit main payment request
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStep(0);

    // Simulate connection progress messages
    const steps = [
      'Establishing handshake with secure gateway...',
      'Encrypting payment details (256-bit AES)...',
      'Contacting card issuer/merchant bank...'
    ];

    let currentStep = 0;
    const progressTimer = setInterval(() => {
      currentStep += 1;
      if (currentStep < steps.length) {
        setLoadingStep(currentStep);
      } else {
        clearInterval(progressTimer);
        setLoading(false);
        if (method === 'upi') {
          // UPI directly proceeds to success for demo
          handleSuccess();
        } else {
          // Card & Net Banking require OTP simulation
          setShowOtp(true);
          setOtpTimer(30);
        }
      }
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setLoading(true);
      setLoadingStep(0);
      
      // Final processing
      setTimeout(() => {
        setLoading(false);
        handleSuccess();
      }, 1500);
    } else {
      alert('Please enter a valid 6-digit passcode.');
    }
  };

  const handleSuccess = () => {
    const transactionId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    let methodLabel = 'Card';
    if (method === 'upi') methodLabel = `UPI (${upiId || 'QR Code'})`;
    if (method === 'netbanking') methodLabel = `Net Banking (${selectedBank})`;
    onSuccess(methodLabel, transactionId);
  };

  const banks = [
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Kotak Mahindra', code: 'KOTAK' },
    { name: 'Punjab National Bank', code: 'PNB' }
  ];

  return (
    <div className="fixed inset-0 bg-[#222222]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E8DEC9]/35 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px] max-h-[90vh] relative animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#222222]/45 hover:text-[#222222] transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Left Side: Summary & Options */}
        <div className="w-full md:w-5/12 bg-[#FFF8F2]/65 border-b md:border-b-0 md:border-r border-[#E8DEC9]/25 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans">Payment Gateway</span>
              <h3 className="text-xl font-serif text-[#222222] mt-1">Aura Skincare</h3>
              <p className="text-xs text-[#222222]/50 font-sans mt-0.5">Secure Transaction Sandbox</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#222222]/40 font-sans">Payable Total</span>
              <h2 className="text-2xl font-semibold font-sans text-[#222222]">{formatRupee(amount)}</h2>
            </div>

            {/* Methods Tab */}
            <div className="space-y-2 font-sans text-xs">
              <button
                onClick={() => { setMethod('card'); setShowOtp(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                  method === 'card' 
                    ? 'border-[#D4AF37] bg-white text-[#222222] shadow-sm font-semibold' 
                    : 'border-[#E8DEC9]/30 hover:bg-[#FAF9F6] text-[#222222]/70'
                }`}
              >
                <CreditCard size={14} className={method === 'card' ? 'text-[#D4AF37]' : ''} />
                <span>Credit/Debit Card</span>
              </button>

              <button
                onClick={() => { setMethod('upi'); setShowOtp(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                  method === 'upi' 
                    ? 'border-[#D4AF37] bg-white text-[#222222] shadow-sm font-semibold' 
                    : 'border-[#E8DEC9]/30 hover:bg-[#FAF9F6] text-[#222222]/70'
                }`}
              >
                <Smartphone size={14} className={method === 'upi' ? 'text-[#D4AF37]' : ''} />
                <span>UPI / QR Code</span>
              </button>

              <button
                onClick={() => { setMethod('netbanking'); setShowOtp(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                  method === 'netbanking' 
                    ? 'border-[#D4AF37] bg-white text-[#222222] shadow-sm font-semibold' 
                    : 'border-[#E8DEC9]/30 hover:bg-[#FAF9F6] text-[#222222]/70'
                }`}
              >
                <Landmark size={14} className={method === 'netbanking' ? 'text-[#D4AF37]' : ''} />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1 text-[9px] text-[#222222]/40 font-sans border-t border-[#E8DEC9]/20 pt-4 mt-4">
            <ShieldCheck size={11} className="text-[#D4AF37]" />
            <span>256-bit SSL secured transaction processing</span>
          </div>
        </div>

        {/* Right Side: Inputs / Forms */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
          {loading ? (
            /* Loading Overlay Screen */
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse font-sans text-xs text-center py-10">
              <Loader2 className="animate-spin text-[#D4AF37]" size={36} />
              <div className="space-y-1">
                <p className="font-semibold text-[#222222]">Processing Order Payment...</p>
                <p className="text-[10px] text-[#222222]/50">
                  {loadingStep === 0 && 'Establishing handshake with secure gateway...'}
                  {loadingStep === 1 && 'Encrypting payment details (256-bit AES)...'}
                  {loadingStep === 2 && 'Contacting bank merchant server...'}
                </p>
              </div>
            </div>
          ) : showOtp ? (
            /* OTP Passcode Screen */
            <form onSubmit={handleOtpSubmit} className="flex-1 flex flex-col justify-between font-sans text-xs">
              <div className="space-y-6 pt-4">
                <div className="text-center space-y-1.5">
                  <div className="mx-auto w-10 h-10 bg-[#FFF8F2] text-[#D4AF37] flex items-center justify-center rounded-full">
                    <KeyRound size={18} />
                  </div>
                  <h4 className="text-sm font-semibold text-[#222222]">Secure Bank Verification</h4>
                  <p className="text-[10px] text-[#222222]/50 px-4">
                    Enter the 6-digit OTP sent to your registered phone ending in ******9821.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-semibold block text-center">
                    Enter Passcode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-40 mx-auto tracking-[0.75em] text-center font-mono font-semibold bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-base focus:outline-none focus:border-[#D4AF37] block"
                    required
                    autoFocus
                  />
                </div>

                <div className="text-center text-[10px] text-[#222222]/50">
                  {otpTimer > 0 ? (
                    <span>Resend OTP in {otpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOtpTimer(30)}
                      className="text-[#D4AF37] font-semibold underline hover:text-[#222222]"
                    >
                      Resend Passcode
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full transition-all mt-6 shadow-md"
              >
                Verify & Approve Payment
              </button>
            </form>
          ) : (
            /* Forms for payment options */
            <div className="flex-1 flex flex-col justify-between font-sans text-xs h-full">
              {/* Method: Credit/Debit Card */}
              {method === 'card' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-1 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Visual Virtual Card */}
                    <div className="perspective-1000 w-full max-w-[290px] mx-auto h-[155px] hidden sm:block">
                      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-2xl bg-gradient-to-tr from-[#1e1e1e] via-[#2d2d2d] to-[#121212] border border-[#E8DEC9]/25 text-[#FAF9F6] p-4 flex flex-col justify-between shadow-lg ${
                        isCardFlipped ? 'rotate-y-180' : ''
                      }`}>
                        {/* Front of Card */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between backface-hidden">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] tracking-[0.25em] font-serif">AURA CIRCLE</span>
                            <span className="text-[9px] font-bold text-[#D4AF37]">SECURED</span>
                          </div>
                          <p className="font-mono text-base tracking-[0.1em] text-center my-1 text-white/95">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[7px] uppercase tracking-wider text-white/40">Holder</p>
                              <p className="font-mono text-[9px] uppercase tracking-wider truncate max-w-[150px]">
                                {cardName || 'NAME ON CARD'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[7px] uppercase tracking-wider text-white/40">Expiry</p>
                              <p className="font-mono text-[9px]">{cardExpiry || 'MM/YY'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#151515] to-[#252525] rounded-2xl border border-[#E8DEC9]/20 flex flex-col justify-between py-4 rotate-y-180 backface-hidden">
                          <div className="w-full bg-[#111] h-8 mt-1"></div>
                          <div className="px-4 flex items-center justify-between">
                            <div className="bg-[#FAF9F6]/10 w-32 h-6 rounded flex items-center justify-end px-2 font-mono text-[8px] italic tracking-widest text-white/40">
                              AURA SKIN
                            </div>
                            <div className="bg-white text-[#222222] font-mono font-bold px-2 py-0.5 rounded text-[10px] w-10 text-center">
                              {cardCvv || '•••'}
                            </div>
                          </div>
                          <div className="px-4 flex justify-between items-center text-[6px] text-white/30 tracking-wider">
                            <span>SECURED BY VISA/MC</span>
                            <span className="text-[#D4AF37]">AURA</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-[#222222]/60 font-semibold">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Eleanor Sterling"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          onFocus={() => setIsCardFlipped(false)}
                          className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/70 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-[#222222]/60 font-semibold">Card Number</label>
                        <input
                          type="text"
                          placeholder="4000 1234 5678 9010"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          onFocus={() => setIsCardFlipped(false)}
                          maxLength={19}
                          className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/70 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#222222]/60 font-semibold">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            onFocus={() => setIsCardFlipped(false)}
                            maxLength={5}
                            className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/70 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-[#222222]/60 font-semibold">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                            onFocus={() => setIsCardFlipped(true)}
                            onBlur={() => setIsCardFlipped(false)}
                            maxLength={3}
                            className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/70 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full transition-all mt-4 shadow-md"
                  >
                    Authorize Card Payment
                  </button>
                </form>
              )}

              {/* Method: UPI Pay */}
              {method === 'upi' && (
                <div className="space-y-6 flex-1 flex flex-col justify-between h-full">
                  <div className="space-y-6 text-center">
                    {/* Simulated QR Code Scan */}
                    <div className="bg-white border border-[#E8DEC9]/30 p-4 rounded-2xl w-44 h-44 mx-auto flex flex-col items-center justify-center space-y-2 shadow-sm">
                      {/* Simple SVG mimicking a beautiful QR Code */}
                      <svg width="120" height="120" viewBox="0 0 100 100" className="text-[#222222]">
                        <rect width="100" height="100" fill="none" />
                        {/* Outer corners */}
                        <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                        <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                        <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="75" width="15" height="15" fill="currentColor" />
                        {/* Mock QR details */}
                        <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                        <rect x="45" y="45" width="10" height="10" fill="white" />
                        <rect x="48" y="48" width="4" height="4" fill="currentColor" />
                        
                        <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                        <rect x="50" y="15" width="12" height="4" fill="currentColor" />
                        <rect x="10" y="35" width="4" height="12" fill="currentColor" />
                        <rect x="15" y="50" width="8" height="8" fill="currentColor" />
                        
                        <rect x="75" y="35" width="15" height="8" fill="currentColor" />
                        <rect x="80" y="50" width="8" height="15" fill="currentColor" />
                        <rect x="35" y="75" width="12" height="12" fill="currentColor" />
                        <rect x="55" y="70" width="8" height="20" fill="currentColor" />
                      </svg>
                      <span className="text-[8px] uppercase tracking-wider text-[#D4AF37] font-semibold">Scan QR via UPI App</span>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-[10px] text-[#222222]/50">
                      <span className="animate-ping rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      <span>Awaiting QR payment scanner completion...</span>
                    </div>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-[#E8DEC9]/20"></div>
                      <span className="flex-shrink mx-4 text-[#222222]/40 text-[9px] uppercase tracking-wider">or pay via UPI VPA</span>
                      <div className="flex-grow border-t border-[#E8DEC9]/20"></div>
                    </div>

                    {/* VPA ID Form */}
                    <div className="space-y-1.5 text-left max-w-sm mx-auto">
                      <label className="text-[9px] uppercase tracking-wider text-[#222222]/60 font-semibold">UPI Virtual Payment Address</label>
                      <div className="flex items-center border border-[#E8DEC9] rounded-xl bg-[#FAF9F6] p-2.5 space-x-2">
                        <input
                          type="text"
                          placeholder="e.g. name@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="bg-transparent border-none outline-none text-xs w-full text-[#222222]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!upiId && method === 'upi'}
                    className="w-full bg-[#222222] hover:bg-[#222222]/90 disabled:bg-[#222222]/40 text-white uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full transition-all shadow-md"
                  >
                    Authorize UPI Pay
                  </button>
                </div>
              )}

              {/* Method: Net Banking */}
              {method === 'netbanking' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-1 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-semibold block">Select Your Institution</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => setSelectedBank(bank.name)}
                          className={`p-3 rounded-xl border text-center font-medium transition-all text-[11px] ${
                            selectedBank === bank.name 
                              ? 'border-[#D4AF37] bg-[#FFF8F2]/60 text-[#222222] font-semibold' 
                              : 'border-[#E8DEC9]/35 hover:bg-[#FAF9F6] text-[#222222]/70'
                          }`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>

                    {selectedBank && (
                      <div className="bg-[#FFF8F2]/30 border border-[#E8DEC9]/20 rounded-xl p-3 flex items-center space-x-2 text-[10px] text-[#222222]/70 leading-relaxed font-sans">
                        <AlertCircle size={12} className="text-[#D4AF37] flex-shrink-0" />
                        <span>You will be redirected to the secure portal of <strong>{selectedBank}</strong> to authorize your payment.</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedBank}
                    className="w-full bg-[#222222] hover:bg-[#222222]/90 disabled:bg-[#222222]/40 text-white uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full transition-all shadow-md"
                  >
                    Establish Secure Bank Link
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
