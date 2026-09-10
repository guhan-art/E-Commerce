import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

interface MobileNavProps {
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const { getTotalItemsCount, setIsCartOpen } = useCartStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  const cartCount = getTotalItemsCount();
  const wishlistCount = wishlistItems.length;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 py-2 px-4 flex items-center justify-around text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
      {/* Home */}
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 p-1 ${
          location.pathname === '/' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      {/* Shop */}
      <Link
        to="/shop"
        className={`flex flex-col items-center gap-1 p-1 ${
          location.pathname.startsWith('/shop') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
        }`}
      >
        <Store className="w-5 h-5" />
        <span>Catalog</span>
      </Link>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 p-1 hover:text-emerald-500"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className={`relative flex flex-col items-center gap-1 p-1 ${
          location.pathname === '/wishlist' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
        }`}
      >
        <Heart className="w-5 h-5" />
        <span>Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 p-1 hover:text-emerald-500"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Bag</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
