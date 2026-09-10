import React, { useState } from 'react';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

export const CouponInput: React.FC = () => {
  const { appliedCoupon, discountPercent, couponDescription, applyCoupon, removeCoupon } = useCartStore();
  const { addToast } = useToastStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const result = await applyCoupon(code);
      if (result.success) {
        addToast({
          title: 'Discount Applied',
          description: result.message,
          type: 'success',
        });
        setCode('');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Error validating coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    addToast({
      title: 'Promo Removed',
      description: 'The discount has been removed from your total.',
      type: 'info',
    });
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
              <span>{appliedCoupon}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100">
                {Math.round(discountPercent * 100)}% OFF
              </span>
            </div>
            {couponDescription && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">{couponDescription}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          title="Remove coupon"
          aria-label="Remove coupon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Promo code (e.g. WELCOME10)"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 uppercase tracking-wider placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center shrink-0"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
        </button>
      </form>
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
