import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductVariant, ProductSizeOption } from '../../types';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/format';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';
import { ShoppingBag, Heart, Check, Plus, Minus, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(
    product.sizeOptions?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const isWishlisted = isInWishlist(product.id);
  const unitPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, selectedSize, quantity);
    addToast({
      title: 'Added to Cart',
      description: `${quantity}x ${product.name} added to your bag.`,
      type: 'success',
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    addToast({
      title: added ? 'Added to Wishlist' : 'Removed from Wishlist',
      description: product.name,
      type: 'info',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative group">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge variant={product.badge === 'Sale' ? 'sale' : 'accent'}>{product.badge}</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-emerald-500 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Selectors */}
        <div className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              {product.category}
            </span>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1 font-display">
              {product.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{product.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size="sm" showScore reviewCount={product.reviewCount} />
            <span className="text-xs text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {product.inStock ? 'In Stock' : 'Backorder'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(unitPrice)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-zinc-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Finish: <span className="font-normal text-zinc-500">{selectedVariant?.name}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {variant.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-400/30 shrink-0"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    )}
                    <span>{variant.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Option / Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSize(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedSize?.id === opt.id
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-zinc-900 dark:text-zinc-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • {formatCurrency(unitPrice * quantity)}</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-rose-500'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View Complete Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
