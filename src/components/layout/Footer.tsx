import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, RefreshCw, Truck, Lock, ArrowRight, Check } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToastStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    addToast({
      title: 'Subscribed to Studio Dispatch',
      description: 'You will receive private drop notices and editorial articles.',
      type: 'success',
    });
    setEmail('');
  };

  const trustBadges = [
    {
      icon: <Truck className="w-5 h-5 text-violet-600" />,
      title: 'Global Priority Dispatch',
      subtitle: 'Free expedited delivery on orders $150+',
      color: 'bg-violet-50 border-violet-200',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-pink-600" />,
      title: '30-Day Risk-Free Trial',
      subtitle: 'Hassle-free returns with prepaid labels',
      color: 'bg-pink-50 border-pink-200',
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      title: '2-Year Craft Warranty',
      subtitle: 'Bespoke replacement on structural defects',
      color: 'bg-amber-50 border-amber-200',
    },
    {
      icon: <Lock className="w-5 h-5 text-cyan-600" />,
      title: 'Bank-Grade Security',
      subtitle: '256-bit SSL encrypted checkout',
      color: 'bg-cyan-50 border-cyan-200',
    },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 shadow-sm transition-colors">
      {/* Trust Badges Strip */}
      <div className="border-b border-slate-200/80 py-10 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className={`p-2.5 rounded-xl border ${badge.color}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{badge.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-0.5 shadow-md shadow-pink-500/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-pink-500">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-violet-700 via-pink-600 to-amber-500 bg-clip-text text-transparent font-display">
                CHROMALUX<span className="text-pink-500">.</span> STUDIO
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed font-medium">
              A chromatic design laboratory curating expressive acoustic hardware, tactile mechanical keyboards, and vibrant workspace tools for forward-thinking creators.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                Join the Colorway Journal
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white text-xs font-bold hover:opacity-95 transition-opacity shadow-md shadow-pink-500/20 flex items-center gap-1.5"
                >
                  {subscribed ? <Check className="w-4 h-4 text-white" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Col 1: Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=Audio" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Acoustic Audio
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Workspace" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Minimal Desk Objects
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Wearables" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Precision Wearables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Optics" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Analog & Digital Optics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Lifestyle" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Lifestyle Artifacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Client Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Client Support
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/orders" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <a href="#returns" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#warranty" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Studio Warranty
                </a>
              </li>
              <li>
                <a href="#contact" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Concierge Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio Ethos */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Studio
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#manifesto" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Our Manifesto
                </a>
              </li>
              <li>
                <a href="#materials" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Responsible Materials
                </a>
              </li>
              <li>
                <a href="#press" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Press Inquiries
                </a>
              </li>
              <li>
                <a href="#careers" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">
                  Careers <span className="text-[10px] text-emerald-500 font-bold ml-1">HIRING</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} AURA Studio Inc. All rights reserved. Crafted by Guhan Raj.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
