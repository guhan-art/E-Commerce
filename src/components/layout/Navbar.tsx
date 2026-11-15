import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Sun,
  Moon,
  User as UserIcon,
  Menu,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useCompareStore } from '../../store/useCompareStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { getTotalItemsCount, setIsCartOpen } = useCartStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const { user, setIsAuthModalOpen } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const compareItems = useCompareStore((s) => s.items);
  const setCompareOpen = useCompareStore((s) => s.setIsOpen);

  const cartCount = getTotalItemsCount();
  const wishlistCount = wishlistItems.length;
  const compareCount = compareItems.length;

  const navLinks = [
    { label: 'Shop All', path: '/shop' },
    { label: 'Audio', path: '/shop?category=Audio' },
    { label: 'Workspace', path: '/shop?category=Workspace' },
    { label: 'Wearables', path: '/shop?category=Wearables' },
    { label: 'Orders', path: '/orders' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-violet-500/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-0.5 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-violet-600">
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-violet-700 via-pink-600 to-amber-500 bg-clip-text text-transparent font-display">
                CHROMALUX
              </span>
              <span className="text-[9px] tracking-widest text-violet-600 font-extrabold uppercase -mt-0.5">
                Colorful Commerce
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20'
                      : 'text-slate-700 hover:text-violet-600 hover:bg-violet-50/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch || (() => navigate('/shop'))}
              className="p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors flex items-center gap-2 border border-slate-200/80"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="w-4 h-4 text-violet-500" />
              <span className="hidden lg:inline-flex text-[11px] text-slate-400 font-semibold px-1 py-0.5 bg-slate-100 rounded">
                /
              </span>
            </button>

            {/* Compare Drawer Trigger (Bonus) */}
            {compareCount > 0 && (
              <button
                onClick={() => setCompareOpen(true)}
                className="relative p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors hidden sm:flex border border-slate-200/80"
                title="Compare items"
                aria-label="Compare items"
              >
                <Layers className="w-4 h-4 text-cyan-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {compareCount}
                </span>
              </button>
            )}

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors border border-slate-200/80"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 text-pink-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors flex items-center gap-1.5 group border border-slate-200/80"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-violet-600 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Modal */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1 rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-2 ml-1"
              title={user ? `Signed in as ${user.name}` : 'Sign In'}
              aria-label="Account"
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-pink-500/60 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1.5 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-slate-600 hover:text-pink-600 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-pink-500" />
                Wishlist ({wishlistCount})
              </Link>
              {compareCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCompareOpen(true);
                  }}
                  className="text-xs font-bold text-cyan-600 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Compare ({compareCount})
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
