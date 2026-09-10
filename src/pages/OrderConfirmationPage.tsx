import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import { formatCurrency } from '../utils/format';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrderStore();

  const order = orderId ? getOrderById(orderId) : undefined;

  useEffect(() => {
    // Fire confetti celebration
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#059669', '#f59e0b', '#3b82f6'],
    });
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Order not located</h2>
        <p className="text-xs text-zinc-500">Could not find record for Order ID: {orderId}</p>
        <Link
          to="/orders"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          View Past Orders
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { key: 'placed', label: 'Order Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'processing', label: 'Studio Fulfillment', icon: <Package className="w-4 h-4" /> },
    { key: 'shipped', label: 'Dispatched in Transit', icon: <Truck className="w-4 h-4" /> },
    { key: 'delivered', label: 'Delivered', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Payment & Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 font-display">
          Thank you, {order.customer.fullName}!
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          We have sent an itemized receipt to <strong className="text-zinc-700 dark:text-zinc-300">{order.customer.email}</strong>. Tracking number: <span className="font-mono font-semibold">{order.trackingNumber}</span>.
        </p>
      </div>

      {/* Live Status Tracker */}
      <div className="bg-white dark:bg-zinc-900/60 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400">Reference Number</span>
            <h3 className="font-mono font-extrabold text-base text-zinc-900 dark:text-zinc-100">{order.id}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Status simulation:</span>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
              className="text-xs px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              <option value="placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Stepper Track */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md ring-4 ring-emerald-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <h5 className={`text-xs font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {step.label}
                  </h5>
                  <span className="text-[10px] text-zinc-400">
                    {idx === 0 ? 'Verified' : idx === 1 ? 'Current' : 'Estimated'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Destination */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">{order.customer.fullName}</p>
            <p>{order.customer.street} {order.customer.apartment && `, ${order.customer.apartment}`}</p>
            <p>{order.customer.city}, {order.customer.state} {order.customer.postalCode}</p>
            <p>{order.customer.country}</p>
            <p className="pt-1 text-zinc-400">Phone: {order.customer.phone}</p>
          </div>
        </div>

        {/* Payment & Logistics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Payment & Carrier Schedule</span>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p><span className="font-semibold text-zinc-900 dark:text-zinc-100">Method:</span> {order.paymentMethod}</p>
            <p><span className="font-semibold text-zinc-900 dark:text-zinc-100">ETA:</span> {order.estimatedDelivery}</p>
            <p><span className="font-semibold text-zinc-900 dark:text-zinc-100">Waybill:</span> {order.trackingNumber}</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              Carbon Neutral Ground & Air Freight
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Order Table */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Purchased Artifacts ({order.items.length})
          </h3>
          <button
            onClick={handlePrint}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {order.items.map((item) => (
            <div key={item.id} className="p-5 flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                {(item.selectedVariantName || item.selectedSizeLabel) && (
                  <p className="text-[11px] text-zinc-400">
                    {[item.selectedVariantName, item.selectedSizeLabel].filter(Boolean).join(' • ')}
                  </p>
                )}
                <span className="text-[11px] text-zinc-400">Qty: {item.quantity}</span>
              </div>
              <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Cost Summary Footer */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Discount ({order.appliedCoupon})</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
          </div>

          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Sales Tax (8%)</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
            <span>Total Paid</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-display">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-center"
        >
          View All Order History
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
