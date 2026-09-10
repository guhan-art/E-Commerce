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
      icon: <Truck className="w-5 h-5 text-emerald-500" />,
      title: 'Global Fast Dispatch',
      subtitle: 'Free expedited delivery on orders $150+',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-emerald-500" />,
      title: '30-Day Risk-Free Trial',
      subtitle: 'Hassle-free returns with prepaid labels',
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      title: '2-Year Craft Warranty',
      subtitle: 'Bespoke replacement on structural defects',
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: 'Bank-Grade Security',
      subtitle: '256-bit SSL encrypted checkout',
    },
  ];

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      {/* Trust Badges Strip */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{badge.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{badge.subtitle}</p>
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
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
                AURA<span className="text-emerald-500">.</span> STUDIO
              </span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              We design and curate uncompromising acoustic hardware, tactile workspace instruments, and minimal lifestyle tools for intentional thinkers.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-2">
                Join the Studio Journal
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-500" /> : <ArrowRight className="w-4 h-4" />}
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
