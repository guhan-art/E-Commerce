import React, { useState } from 'react';
import { PaymentDetails } from '../../types';
import { CreditCard, QrCode, Banknote, ShieldCheck, Lock } from 'lucide-react';

interface PaymentFormProps {
  payment: PaymentDetails;
  onChange: (payment: PaymentDetails) => void;
  errors: Partial<Record<keyof PaymentDetails, string>>;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onChange, errors }) => {
  const [cardFlip, setCardFlip] = useState(false);

  const handleMethodChange = (method: PaymentDetails['method']) => {
    onChange({ ...payment, method });
  };

  const handleFieldChange = (field: keyof PaymentDetails, val: string) => {
    onChange({ ...payment, [field]: val });
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  return (
    <div className="space-y-6">
      {/* Method Selection Tabs */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => handleMethodChange('card')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
            payment.method === 'card'
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange('upi')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
            payment.method === 'upi'
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span>UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange('cod')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
            payment.method === 'cod'
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
          }`}
        >
          <Banknote className="w-5 h-5" />
          <span>Pay on Delivery</span>
        </button>
      </div>

      {/* Credit Card Flow */}
      {payment.method === 'card' && (
        <div className="space-y-5">
          {/* Interactive Card Preview */}
          <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl p-5 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-950 text-white shadow-xl flex flex-col justify-between border border-zinc-700/60 overflow-hidden font-mono select-none">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center">
              <span className="text-xs tracking-widest uppercase font-bold text-zinc-400 font-sans">
                AURA Studio Black Card
              </span>
              <div className="w-8 h-6 rounded bg-amber-400/80 shadow-inner flex items-center justify-center">
                <div className="w-6 h-4 border border-black/20 rounded-sm" />
              </div>
            </div>

            <div className="text-lg tracking-widest text-zinc-100 font-bold">
              {payment.cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-sans">Cardholder</span>
                <span className="font-semibold uppercase tracking-wide truncate max-w-[170px] block">
                  {payment.cardHolder || 'GUHAN RAJ'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-sans">Expires</span>
                <span className="font-semibold">{payment.cardExpiry || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={payment.cardNumber || ''}
                onChange={(e) => handleFieldChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 ${
                  errors.cardNumber
                    ? 'border-rose-500 focus:ring-rose-500/40'
                    : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
                }`}
              />
              {errors.cardNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.cardNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                value={payment.cardHolder || ''}
                onChange={(e) => handleFieldChange('cardHolder', e.target.value)}
                placeholder="Guhan Raj"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
                  errors.cardHolder
                    ? 'border-rose-500 focus:ring-rose-500/40'
                    : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
                }`}
              />
              {errors.cardHolder && <p className="text-[11px] text-rose-500 mt-1">{errors.cardHolder}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={payment.cardExpiry || ''}
                  onChange={(e) => handleFieldChange('cardExpiry', formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 ${
                    errors.cardExpiry
                      ? 'border-rose-500 focus:ring-rose-500/40'
                      : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
                  }`}
                />
                {errors.cardExpiry && <p className="text-[11px] text-rose-500 mt-1">{errors.cardExpiry}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Security Code (CVV)
                </label>
                <input
                  type="password"
                  value={payment.cardCvv || ''}
                  onChange={(e) => handleFieldChange('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 ${
                    errors.cardCvv
                      ? 'border-rose-500 focus:ring-rose-500/40'
                      : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
                  }`}
                />
                {errors.cardCvv && <p className="text-[11px] text-rose-500 mt-1">{errors.cardCvv}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI / QR Flow */}
      {payment.method === 'upi' && (
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-4">
          <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl shadow-md border border-zinc-200 flex flex-col items-center justify-center">
            {/* Mock QR SVG */}
            <svg className="w-full h-full text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-5 0h2v3h-2v-3zm0 5h2v3h-2v-3zm3 0h3v3h-3v-3zM5 11h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
              Scan with any UPI app (GPay, PhonePe, Paytm)
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Instant zero-fee settlement with real-time biometric verification
            </p>
          </div>
          <div className="max-w-xs mx-auto">
            <input
              type="text"
              value={payment.upiId || ''}
              onChange={(e) => handleFieldChange('upiId', e.target.value)}
              placeholder="Or enter UPI ID (e.g. username@okhdfcbank)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      )}

      {/* COD Flow */}
      {payment.method === 'cod' && (
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
            <Banknote className="w-4 h-4 text-emerald-500" />
            <span>Pay in Cash or Card upon delivery</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Our private courier partner will collect exact funds or swipe your card at your doorstep upon package inspection.
          </p>
        </div>
      )}

      {/* Security notice */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 justify-center pt-2">
        <Lock className="w-3.5 h-3.5 text-emerald-500" />
        <span>Transactions are end-to-end encrypted with 256-bit TLS</span>
      </div>
    </div>
  );
};
