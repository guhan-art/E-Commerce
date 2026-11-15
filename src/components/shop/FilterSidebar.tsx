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
      <div className="flex items-center justify-between pb-4 border-b border-indigo-100">
        <div>
          <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 animate-pulse" />
            Filters
          </h3>
          <span className="text-xs text-violet-600/80 font-medium">
            {totalProductsCount} {totalProductsCount === 1 ? 'item found' : 'items found'}
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-violet-600 hover:text-pink-600 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-pink-50"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-violet-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search audio, keyboard, desk..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-violet-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-pink-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 mb-2.5">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-zinc-700 hover:bg-violet-50/80 hover:text-violet-700'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-700">
            Max Price
          </label>
          <span className="text-xs font-black text-violet-700 bg-violet-100 px-2 py-0.5 rounded-md">
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
          className="w-full h-2 bg-gradient-to-r from-violet-200 via-pink-200 to-amber-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-semibold">
          <span>$50</span>
          <span>$500</span>
          <span>$1,000+</span>
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-2">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 group-hover:text-violet-600 transition-colors">
            In-Stock Only
          </span>
          <div
            onClick={handleInStockToggle}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              filters.inStockOnly ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-zinc-300'
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
        <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 mb-2">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingChange(stars)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                filters.minRating === stars
                  ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold shadow-sm'
                  : 'border-zinc-200 text-zinc-600 hover:bg-violet-50/60 hover:border-violet-200'
              }`}
            >
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
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
              className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-500/25"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-indigo-100 shadow-sm sticky top-24">
      {content}
    </div>
  );
};
