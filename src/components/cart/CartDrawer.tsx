import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/format';
import { FreeShippingMeter } from './FreeShippingMeter';
import { CouponInput } from './CouponInput';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    getTotalItemsCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();
  const totalCount = getTotalItemsCount();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Your Cart ({totalCount})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free shipping bar */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/60">
                <FreeShippingMeter subtotal={subtotal} target={150} />
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                        Your bag is empty
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
                        Explore our handcrafted acoustic devices and workspace essentials to fill it up.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/shop');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Browse All Products
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const basePrice = item.product.price;
                    const mod = item.selectedVariant?.priceModifier || 0;
                    const unitPrice = basePrice + mod;

                    return (
                      <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                              {item.product.name}
                            </h5>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {(item.selectedVariant || item.selectedSize) && (
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 space-x-1.5">
                              {item.selectedVariant && <span>{item.selectedVariant.name}</span>}
                              {item.selectedVariant && item.selectedSize && <span>•</span>}
                              {item.selectedSize && <span>{item.selectedSize.label}</span>}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2.5">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Summary & Checkout Button */}
              {items.length > 0 && (
                <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3.5">
                  <CouponInput />

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shipping)}</span>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      <span>Estimated Total</span>
                      <span className="text-base text-emerald-600 dark:text-emerald-400">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-center text-[10px] text-zinc-400">
                    Taxes calculated during checkout • 30-Day Guaranteed Returns
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
