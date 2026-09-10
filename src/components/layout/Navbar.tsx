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
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
                AURA<span className="text-emerald-500">.</span>
              </span>
              <span className="text-[9px] tracking-widest text-zinc-400 font-semibold uppercase -mt-1">
                Studio
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch || (() => navigate('/shop'))}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors flex items-center gap-2"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline-flex text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded px-1.5 py-0.5">
                /
              </span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Compare Drawer Trigger (Bonus) */}
            {compareCount > 0 && (
              <button
                onClick={() => setCompareOpen(true)}
                className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors hidden sm:flex"
                title="Compare items"
                aria-label="Compare items"
              >
                <Layers className="w-5 h-5 text-emerald-500" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                  {compareCount}
                </span>
              </button>
            )}

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-950 animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors flex items-center gap-1.5 group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Modal */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 ml-1"
              title={user ? `Signed in as ${user.name}` : 'Sign In'}
              aria-label="Account"
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-2 ring-emerald-500/50 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
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
            className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-5 space-y-1.5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                Wishlist ({wishlistCount})
              </Link>
              {compareCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCompareOpen(true);
                  }}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
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
