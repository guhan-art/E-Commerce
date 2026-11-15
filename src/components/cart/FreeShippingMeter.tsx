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
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-50 via-pink-50 to-amber-50 border border-violet-200 text-xs shadow-xs">
      <div className="flex items-center justify-between font-bold text-slate-900 mb-1.5">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-violet-600 shrink-0" />
          {diff > 0 ? (
            <span>
              Add <span className="font-extrabold text-violet-700 underline decoration-pink-500">{formatCurrency(diff)}</span> more for <strong>Free Express Freight</strong>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-violet-700 font-black">
              <CheckCircle2 className="w-4 h-4 text-pink-500" /> You unlocked Free Priority Delivery!
            </span>
          )}
        </div>
        <span className="text-[11px] font-black text-violet-600">{percentage}%</span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 rounded-full transition-all duration-500 ease-out shadow-xs"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
