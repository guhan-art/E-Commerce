import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { INITIAL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Search, ArrowRight, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results: Product[] = query.trim()
    ? INITIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : INITIAL_PRODUCTS.slice(0, 4);

  const handleSelect = (product: Product) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const handleSearchAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Search Field */}
        <form onSubmit={handleSearchAll} className="relative">
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search audio, workspace gear, optics, accessories..."
            className="w-full pl-11 pr-10 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Live suggestions */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            <span>{query ? 'Matching Studio Artifacts' : 'Suggested Curations'}</span>
            {query && <span>{results.length} found</span>}
          </div>

          <div className="space-y-1.5 divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product)}
                className="pt-1.5 first:pt-0 flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-emerald-500 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {product.tagline}
                  </p>
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                  {formatCurrency(product.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {query && (
          <button
            onClick={handleSearchAll}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>View all search results for "{query}"</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </Modal>
  );
};
