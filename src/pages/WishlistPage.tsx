import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { ProductCard } from '../components/shop/ProductCard';
import { CompareDrawer } from '../components/shop/CompareDrawer';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((product) => {
      addItem(product, product.variants?.[0], product.sizeOptions?.[0], 1);
    });

    addToast({
      title: 'Wishlist Moved to Cart',
      description: `Added ${items.length} items to your bag.`,
      type: 'success',
    });
    navigate('/cart');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-display">
          Your wishlist is empty
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Tap the heart icon on any acoustic instrument or workspace object in our catalog to save it for later consideration.
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Saved Curations
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
            Studio Wishlist ({items.length})
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Keep track of coveted editions, compare finishes, or move everything straight into your bag.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearWishlist}
            className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>

          <button
            onClick={handleMoveAllToCart}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All to Bag</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <CompareDrawer />
    </div>
  );
};
