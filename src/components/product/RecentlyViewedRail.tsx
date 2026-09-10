import React from 'react';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import { ProductCard } from '../shop/ProductCard';
import { Clock, Trash2 } from 'lucide-react';

interface RecentlyViewedRailProps {
  currentProductId?: string;
}

export const RecentlyViewedRail: React.FC<RecentlyViewedRailProps> = ({ currentProductId }) => {
  const { items, clearHistory } = useRecentlyViewedStore();

  const filtered = items.filter((p) => p.id !== currentProductId);

  if (filtered.length === 0) return null;

  return (
    <div className="pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-500" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">
            Recently Viewed
          </h3>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1"
          title="Clear browsing history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
