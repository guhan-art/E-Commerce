import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/format';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface OrderSummarySidebarProps {
  shippingMethodCost?: number;
}

export const OrderSummarySidebar: React.FC<OrderSummarySidebarProps> = ({
  shippingMethodCost,
}) => {
  const {
    items,
    appliedCoupon,
    discountPercent,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
    getTotalItemsCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const baseShipping = getShipping();
  const shipping = shippingMethodCost !== undefined ? shippingMethodCost : baseShipping;
  const tax = getTax();
  const total = Math.max(0, subtotal - discount + shipping + tax);
  const totalCount = getTotalItemsCount();

  return (
    <div className="bg-white dark:bg-zinc-900/70 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 sticky top-24 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Order Summary
        </h3>
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Item List */}
      <div className="max-h-60 overflow-y-auto space-y-3.5 pr-1 divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {items.map((item) => {
          const unitPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);

          return (
            <div key={item.cartItemId} className="pt-3.5 first:pt-0 flex gap-3 items-center">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-800 dark:bg-zinc-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                  {item.product.name}
                </h5>
                {(item.selectedVariant || item.selectedSize) && (
                  <p className="text-[11px] text-zinc-400 truncate">
                    {[item.selectedVariant?.name, item.selectedSize?.label].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>

              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(unitPrice * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cost Breakdown */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Discount ({appliedCoupon})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Shipping</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(tax)}</span>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
          <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Total</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-display">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Guarantee Badges */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-500" />
          <span>30-Day Risk-Free Money Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-500" />
          <span>Carbon-Neutral Freight & Tracking Included</span>
        </div>
      </div>
    </div>
  );
};
