import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/format';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCompareStore } from '../../store/useCompareStore';
import { useToastStore } from '../../store/useToastStore';
import { Heart, ShoppingBag, Eye, Layers, Check } from 'lucide-react';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, items: compareItems } = useCompareStore();
  const { addToast } = useToastStore();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = compareItems.some((p) => p.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants?.[0], product.sizeOptions?.[0], 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);

    addToast({
      title: 'Added to Cart',
      description: `${product.name} added to your bag.`,
      type: 'success',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    addToast({
      title: added ? 'Saved to Wishlist' : 'Removed from Wishlist',
      description: product.name,
      type: 'info',
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleCompare(product);
    addToast({
      title: added ? 'Added to Comparison' : 'Removed from Comparison',
      description: product.name,
      type: 'info',
    });
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <>
        <div className="group relative flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm hover:shadow-md">
          {/* Thumbnail */}
          <Link
            to={`/product/${product.id}`}
            className="w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative shrink-0 block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <div className="absolute top-2.5 left-2.5">
                <Badge variant={product.badge === 'Sale' ? 'sale' : 'accent'}>{product.badge}</Badge>
              </div>
            )}
          </Link>

          {/* Details */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCompare}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isCompared
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                  title="Compare"
                  aria-label="Compare"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleWishlist}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isWishlisted
                      ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-rose-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            <Link to={`/product/${product.id}`}>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 transition-colors mt-1 font-display">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
              {product.description}
            </p>

            <div className="mt-2.5 flex items-center gap-3">
              <StarRating rating={product.rating} size="sm" showScore reviewCount={product.reviewCount} />
              <span className="text-xs text-zinc-400">
                {product.stockCount <= 5 ? (
                  <strong className="text-amber-500">Only {product.stockCount} left!</strong>
                ) : (
                  'In Stock'
                )}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-zinc-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openQuickView}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Quick View
                </button>
                <button
                  onClick={handleQuickAdd}
                  className="px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {addedAnim ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  <span>{addedAnim ? 'Added' : 'Add to Bag'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
      </>
    );
  }

  // DEFAULT GRID VIEW LAYOUT
  return (
    <>
      <div
        className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Frame */}
        <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800/60 overflow-hidden">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <Badge variant={product.badge === 'Sale' ? 'sale' : product.badge === 'Limited Edition' ? 'gold' : 'accent'}>
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Action buttons overlay (Wishlist & Compare) */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 scale-105'
                  : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-110'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleCompare}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                isCompared
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 scale-105'
                  : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 hover:scale-110'
              }`}
              title={isCompared ? 'Remove from compare' : 'Compare product'}
              aria-label="Compare"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Quick View Hover Bar */}
          <div
            className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-200 transform ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={openQuickView}
              className="w-full py-2 px-3 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-lg flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick Preview</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
              <span>{product.category}</span>
              {product.variants && product.variants.length > 0 && (
                <span>{product.variants.length} finishes</span>
              )}
            </div>

            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors line-clamp-1 font-display">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
              {product.tagline}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-zinc-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="mt-0.5">
                <StarRating rating={product.rating} size="sm" showScore reviewCount={product.reviewCount} />
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className={`p-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center shadow-sm ${
                addedAnim
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white'
              }`}
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              {addedAnim ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
};
