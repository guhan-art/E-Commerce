import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, ProductVariant, ProductSizeOption } from '../types';
import { api } from '../services/api';
import { ImageGallery } from '../components/product/ImageGallery';
import { ReviewSection } from '../components/product/ReviewSection';
import { RecentlyViewedRail } from '../components/product/RecentlyViewedRail';
import { ProductCard } from '../components/shop/ProductCard';
import { CompareDrawer } from '../components/shop/CompareDrawer';
import { StarRating } from '../components/common/StarRating';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/format';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCompareStore } from '../store/useCompareStore';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { useToastStore } from '../store/useToastStore';
import {
  ShoppingBag,
  Heart,
  Layers,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Zap,
  ArrowLeft,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Variant selections
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'shipping'>('features');
  const [addedAnim, setAddedAnim] = useState(false);

  // Stores
  const { addItem, setIsCartOpen } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, items: compareItems } = useCompareStore();
  const { addProduct: trackRecentlyViewed } = useRecentlyViewedStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo(0, 0);

    api.getProductById(id).then((prod) => {
      if (prod) {
        setProduct(prod);
        setSelectedVariant(prod.variants?.[0]);
        setSelectedSize(prod.sizeOptions?.[0]);
        setQuantity(1);
        trackRecentlyViewed(prod);

        api.getRelatedProducts(prod.id, 4).then((rel) => {
          setRelated(rel);
        });
      }
      setLoading(false);
    });
  }, [id, trackRecentlyViewed]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Product not found</h2>
        <p className="text-xs text-zinc-500">The product you are looking for does not exist or has been retired.</p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isCompared = compareItems.some((p) => p.id === product.id);
  const unitPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, selectedSize, quantity);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);

    addToast({
      title: 'Added to Cart',
      description: `${quantity}x ${product.name} added to your bag.`,
      type: 'success',
    });
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, selectedSize, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    addToast({
      title: added ? 'Added to Wishlist' : 'Removed from Wishlist',
      description: product.name,
      type: 'info',
    });
  };

  const handleToggleCompare = () => {
    const added = toggleCompare(product);
    addToast({
      title: added ? 'Added to Compare' : 'Removed from Compare',
      description: product.name,
      type: 'info',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to products</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product Configurations & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                {product.category}
              </span>
              {product.badge && (
                <Badge variant={product.badge === 'Sale' ? 'sale' : 'accent'}>{product.badge}</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display">
              {product.name}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{product.tagline}</p>
          </div>

          {/* Rating & Stock row */}
          <div className="flex items-center gap-4 py-2 border-y border-zinc-200/80 dark:border-zinc-800/80 text-xs">
            <StarRating rating={product.rating} size="sm" showScore reviewCount={product.reviewCount} />
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {product.inStock
                  ? `In Stock (${product.stockCount} units available)`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100 font-display">
              {formatCurrency(unitPrice)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-zinc-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {selectedVariant?.priceModifier ? (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                (+{formatCurrency(selectedVariant.priceModifier)} for selected finish)
              </span>
            ) : null}
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Variant: Colors */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Finish:{' '}
                <span className="font-normal text-zinc-500 dark:text-zinc-400">
                  {selectedVariant?.name}
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-400/40 shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant: Size / Spec */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Configuration
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.sizeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSize(opt)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedSize?.id === opt.id
                        ? 'border-emerald-500 bg-emerald-500 text-white font-bold shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Primary Actions */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center justify-between border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 px-1 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
              >
                {addedAnim ? <Check className="w-4 h-4 text-white" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{addedAnim ? 'Added to Bag!' : `Add to Bag • ${formatCurrency(unitPrice * quantity)}`}</span>
              </button>

              {/* Wishlist & Compare */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-rose-500'
                  }`}
                  title="Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  onClick={handleToggleCompare}
                  className={`p-3 rounded-xl border transition-colors ${
                    isCompared
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-emerald-500'
                  }`}
                  title="Compare"
                  aria-label="Compare"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buy Now One-Click */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Instant Buy with Express Checkout</span>
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Free Delivery $150+</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>30-Day Risk-Free</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Specs & Highlights */}
      <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6">
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'features'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Acoustic & Craft Highlights
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'specs'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'shipping'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Freight & Care Warranty
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'features' && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {product.features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'specs' && (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {Object.entries(product.specs).map(([label, val]) => (
                    <tr key={label} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                      <td className="py-3 px-4 font-semibold text-zinc-500 dark:text-zinc-400 w-1/3">
                        {label}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs text-zinc-600 dark:text-zinc-300">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Dispatch & Return Guarantees
              </h4>
              <p>
                All orders are dispatched from our San Francisco warehouse within 24 business hours using carbon-neutral freight carriers (DHL Express / FedEx Priority).
              </p>
              <p>
                We include a prepaid return label inside every box. If you are not entirely enchanted by the physical acoustics or ergonomics within 30 days, ship it back in original packaging for a 100% refund.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product.id}
        reviews={product.reviews}
        rating={product.rating}
        reviewCount={product.reviewCount}
        onReviewAdded={(newRev) => {
          setProduct((prev) =>
            prev
              ? {
                  ...prev,
                  reviews: [newRev, ...prev.reviews],
                  reviewCount: prev.reviewCount + 1,
                  rating: Number(
                    (
                      (prev.rating * prev.reviewCount + newRev.rating) /
                      (prev.reviewCount + 1)
                    ).toFixed(1)
                  ),
                }
              : null
          );
        }}
      />

      {/* Related Products Showcase */}
      {related.length > 0 && (
        <div className="pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Pair Well Together
              </span>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-0.5">
                Related Studio Editions
              </h3>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 transition-colors"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Rail */}
      <RecentlyViewedRail currentProductId={product.id} />

      <CompareDrawer />
    </div>
  );
};
