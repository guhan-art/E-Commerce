import React from 'react';
import { FilterState, Category } from '../../types';
import { CATEGORIES } from '../../data/products';
import { Search, RotateCcw, X, Star, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalProductsCount: number;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalProductsCount,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const handleCategoryChange = (category: Category) => {
    onChange({ ...filters, category });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleInStockToggle = () => {
    onChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const content = (
    <div className="space-y-6">
      {/* Header with count and reset */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Filters
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {totalProductsCount} {totalProductsCount === 1 ? 'item found' : 'items found'}
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search headphones, desk..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2.5">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Max Price
          </label>
          <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="25"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-semibold">
          <span>$50</span>
          <span>$500</span>
          <span>$1,000+</span>
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-2">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
            In-Stock Only
          </span>
          <div
            onClick={handleInStockToggle}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              filters.inStockOnly ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                filters.inStockOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingChange(stars)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                filters.minRating === stars
                  ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span>{stars}★ & above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-xs bg-white dark:bg-zinc-900 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Filter Catalog</h2>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <button
              onClick={onCloseMobile}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 sticky top-24">
      {content}
    </div>
  );
};
