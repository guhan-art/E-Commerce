import React from 'react';
import { useCompareStore } from '../../store/useCompareStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { X, ShoppingBag, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompareDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, removeItem, clearCompare } = useCompareStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  if (items.length === 0) return null;

  const handleAddToCart = (product: any) => {
    addItem(product, product.variants?.[0], product.sizeOptions?.[0], 1);
    addToast({
      title: 'Added to Bag',
      description: `${product.name} added to your cart.`,
      type: 'success',
    });
  };

  return (
    <>
      {/* Floating Bottom Bar when items are selected */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 bg-zinc-900/95 dark:bg-zinc-800/95 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-zinc-700/60 flex items-center gap-4 max-w-xl w-[92%] sm:w-auto">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold whitespace-nowrap">
            {items.length} {items.length === 1 ? 'Item' : 'Items'} selected to compare
          </span>
        </div>

        {/* Small thumbnails */}
        <div className="flex -space-x-2 overflow-hidden">
          {items.map((item) => (
            <img
              key={item.id}
              src={item.images[0]}
              alt={item.name}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900 object-cover"
            />
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors whitespace-nowrap"
          >
            Compare Now
          </button>
          <button
            onClick={clearCompare}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
            title="Clear comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Side-by-Side Product Comparison" maxWidth="4xl">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 w-40 text-xs font-bold uppercase text-zinc-400">Spec / Feature</th>
                {items.map((item) => (
                  <th key={item.id} className="p-4 w-56 align-top">
                    <div className="relative group">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-rose-500"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-36 object-cover rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-2"
                      />
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="mt-1 text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="mt-2.5">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              <tr>
                <td className="p-4 font-semibold text-zinc-500 dark:text-zinc-400">Rating</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4">
                    <StarRating rating={item.rating} size="sm" showScore reviewCount={item.reviewCount} />
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-500 dark:text-zinc-400">Availability</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4">
                    <span
                      className={`font-semibold ${
                        item.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                      }`}
                    >
                      {item.inStock ? `In Stock (${item.stockCount} units)` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-500 dark:text-zinc-400">Key Highlights</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4">
                    <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px]">
                      {item.features.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-500 dark:text-zinc-400">Variants Available</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {item.variants ? `${item.variants.length} color choices` : 'Standard edition'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-500 dark:text-zinc-400">Warranty</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-zinc-700 dark:text-zinc-300">
                    2-Year Limited Studio Warranty
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};
