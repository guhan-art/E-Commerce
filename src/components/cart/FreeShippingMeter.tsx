import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface FreeShippingMeterProps {
  subtotal: number;
  target?: number;
}

export const FreeShippingMeter: React.FC<FreeShippingMeterProps> = ({
  subtotal,
  target = 150,
}) => {
  const diff = Math.max(0, target - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / target) * 100));

  return (
    <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 text-xs">
      <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300 mb-1.5">
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          {diff > 0 ? (
            <span>
              Add <span className="underline decoration-emerald-500">{formatCurrency(diff)}</span> more for <strong>Free Priority Shipping</strong>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> You unlocked Free Priority Shipping!
            </span>
          )}
        </div>
        <span className="text-[11px] opacity-80">{percentage}%</span>
      </div>

      <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
