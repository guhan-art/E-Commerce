import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/format';
import { INITIAL_PRODUCTS } from '../data/products';
import {
  Package,
  Search,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      const product = INITIAL_PRODUCTS.find((p) => p.id === item.productId) || {
        id: item.productId,
        slug: item.productId,
        name: item.name,
        tagline: '',
        description: '',
        category: 'Audio' as const,
        price: item.price,
        rating: 4.8,
        reviewCount: 50,
        inStock: true,
        stockCount: 10,
        images: [item.image],
        features: [],
        specs: {},
        reviews: [],
        createdAt: new Date().toISOString(),
      };
      addItem(product, undefined, undefined, item.quantity);
    });

    addToast({
      title: 'Items Added to Bag',
      description: `Reordered ${order.items.length} items from ${order.id}.`,
      type: 'success',
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Account Management
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
            Order History & Dispatch Status
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Review past acquisitions, track current studio shipments, and download tax invoices.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or item..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-200/60 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No matching orders found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            You haven't placed any orders matching this search query yet.
          </p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-colors shadow-sm"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-5 bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">Order Placed</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{dateFormatted}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Amount</span>
                      <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">Ship To</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {order.customer.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-500 font-semibold">{order.id}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {order.status === 'delivered' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : order.status === 'shipped' ? (
                        <Truck className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="p-5 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.productId}`}>
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 transition-colors truncate">
                            {item.name}
                          </h4>
                        </Link>
                        {(item.selectedVariantName || item.selectedSizeLabel) && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {[item.selectedVariantName, item.selectedSizeLabel].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        <span className="text-[11px] text-zinc-400">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-zinc-500 text-[11px]">
                    Waybill tracking: <span className="font-mono text-zinc-700 dark:text-zinc-300">{order.trackingNumber}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder All</span>
                    </button>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Track & Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
