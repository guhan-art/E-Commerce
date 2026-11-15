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
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-indigo-100 py-2 px-4 flex items-center justify-around text-[10px] font-semibold text-zinc-600 shadow-lg">
      {/* Home */}
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 p-1 ${
          location.pathname === '/' ? 'text-violet-600 font-extrabold' : 'hover:text-violet-600'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      {/* Shop */}
      <Link
        to="/shop"
        className={`flex flex-col items-center gap-1 p-1 ${
          location.pathname.startsWith('/shop') ? 'text-violet-600 font-extrabold' : 'hover:text-violet-600'
        }`}
      >
        <Store className="w-5 h-5" />
        <span>Catalog</span>
      </Link>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 p-1 hover:text-violet-600"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className={`relative flex flex-col items-center gap-1 p-1 ${
          location.pathname === '/wishlist' ? 'text-pink-600 font-extrabold' : 'hover:text-pink-600'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span>Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 p-1 hover:text-violet-600"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Bag</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
