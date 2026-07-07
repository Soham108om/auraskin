import React, { useState } from 'react';
import { trackEvent } from '../utils/analytics';
import { Mail, MessageCircle, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && subject) {
      // Trigger GA4 contact_submit
      trackEvent({
        name: 'contact_submit',
        params: { name, email, subject },
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      alert("Your message has been sent to our skin concierge team! We'll reply within 24 hours.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Column: Info */}
      <div className="space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Support Concierge</span>
        <h1 className="text-4xl font-serif text-[#222222]">Contact AuraSkin</h1>
        <p className="text-sm text-[#222222]/70 leading-relaxed font-sans font-light">
          Have a question about our formulas? Need assistance with building your routine? Our skincare experts are available to guide you.
        </p>

        <div className="space-y-4 pt-4 text-xs font-sans text-[#222222]/80">
          <div className="flex items-center space-x-3">
            <Mail size={16} className="text-[#D4AF37]" />
            <span>concierge@auraskin.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <MessageCircle size={16} className="text-[#D4AF37]" />
            <span>Chat support: Mon–Fri, 9am–5pm EST</span>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="bg-[#FFF8F2]/40 border border-[#E8DEC9]/30 rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-serif text-[#222222] mb-4">Send a Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

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
            <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Subject / Concern</label>
            <input
              type="text"
              placeholder="e.g. Skin Sensitivity Questions"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#222222]/60 font-sans font-semibold">Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your message details..."
              className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
          >
            <span>Submit Message</span>
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
};
