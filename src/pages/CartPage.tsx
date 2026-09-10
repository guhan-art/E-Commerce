import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../utils/format';
import { FreeShippingMeter } from '../components/cart/FreeShippingMeter';
import { CouponInput } from '../components/cart/CouponInput';
import { INITIAL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
    getTotalItemsCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const totalCount = getTotalItemsCount();

  const trendingPicks = INITIAL_PRODUCTS.slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-display">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Your personal studio cart currently has no items. Explore our curated selection of acoustic headphones, mechanical keyboards, and workspace objects.
          </p>
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recommended for you */}
        <div className="pt-16 border-t border-zinc-200 dark:border-zinc-800 text-left space-y-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">
            Trending Picks You Might Love
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Shopping Cart
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
            Studio Bag ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items List Table */}
        <div className="lg:col-span-2 space-y-4">
          <FreeShippingMeter subtotal={subtotal} target={150} />

          <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden shadow-sm">
            {items.map((item) => {
              const unitPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);

              return (
                <div key={item.cartItemId} className="p-5 flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 w-full space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      {item.product.category}
                    </span>
                    <Link to={`/product/${item.product.id}`}>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 transition-colors">
                        {item.product.name}
                      </h4>
                    </Link>

                    {(item.selectedVariant || item.selectedSize) && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {[item.selectedVariant?.name, item.selectedSize?.label].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    <div className="text-xs text-zinc-400">
                      Unit: {formatCurrency(unitPrice)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total price for item */}
                  <div className="text-right font-extrabold text-sm text-zinc-900 dark:text-zinc-100 min-w-[80px]">
                    {formatCurrency(unitPrice * item.quantity)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-6 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Summary
            </h3>

            <CouponInput />

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Freight Shipping</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(tax)}</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Estimated Total</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Complimentary Returns within 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
