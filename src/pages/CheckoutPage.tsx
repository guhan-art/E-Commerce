import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShippingAddress, PaymentDetails, Order } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import { AddressForm } from '../components/checkout/AddressForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderSummarySidebar } from '../components/checkout/OrderSummarySidebar';
import { generateOrderId, generateTrackingNumber, formatCurrency } from '../utils/format';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    appliedCoupon,
    discountPercent,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    clearCart,
  } = useCartStore();

  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [shippingTier, setShippingTier] = useState<'standard' | 'priority'>('standard');

  // Address State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || 'Guhan Raj',
    email: user?.email || 'demo@aura.design',
    phone: '+1 (555) 438-9921',
    street: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
  });

  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  // Payment State
  const [payment, setPayment] = useState<PaymentDetails>({
    method: 'card',
    cardNumber: '4242 4242 4242 4242',
    cardHolder: user?.name || 'GUHAN RAJ',
    cardExpiry: '12/28',
    cardCvv: '789',
    upiId: '',
  });

  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Securing 256-bit TLS connection...');

  // Redirect if cart is empty
  if (items.length === 0 && !isProcessing) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">No items in your cart</h2>
        <p className="text-xs text-zinc-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Shipping cost calculation based on chosen tier
  const baseShipping = getShipping();
  const shippingCost = shippingTier === 'priority' ? 25 : baseShipping;

  // Validate step 1
  const validateAddress = (): boolean => {
    const errs: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!address.fullName.trim()) errs.fullName = 'Full name is required';
    if (!address.email.trim() || !address.email.includes('@')) errs.email = 'Valid email is required';
    if (!address.phone.trim()) errs.phone = 'Phone number is required';
    if (!address.street.trim()) errs.street = 'Street address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'State / Province is required';
    if (!address.postalCode.trim()) errs.postalCode = 'Zip / Postal code is required';

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate step 3 (Payment)
  const validatePayment = (): boolean => {
    const errs: Partial<Record<keyof PaymentDetails, string>> = {};
    if (payment.method === 'card') {
      if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length < 16) {
        errs.cardNumber = 'Valid 16-digit card number required';
      }
      if (!payment.cardHolder?.trim()) errs.cardHolder = 'Cardholder name is required';
      if (!payment.cardExpiry || payment.cardExpiry.length < 5) errs.cardExpiry = 'MM/YY required';
      if (!payment.cardCvv || payment.cardCvv.length < 3) errs.cardCvv = '3 or 4 digits required';
    } else if (payment.method === 'upi') {
      if (!payment.upiId && payment.upiId !== '') {
        errs.upiId = 'UPI handle required or scan QR code';
      }
    }
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateAddress()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  // Submit Order and run simulated payment flow
  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    const stages = [
      'Establishing end-to-end encrypted handshake...',
      'Verifying account authorization with clearinghouse...',
      'Allocating inventory in San Francisco fulfillment center...',
      'Generating unique dispatch waybill & receipt...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise((r) => setTimeout(r, 650));
    }

    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber();
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const tax = getTax();
    const total = Math.max(0, subtotal - discount + shippingCost + tax);

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: address,
      items: items.map((item) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        productId: item.product.id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price + (item.selectedVariant?.priceModifier || 0),
        quantity: item.quantity,
        selectedVariantName: item.selectedVariant?.name,
        selectedSizeLabel: item.selectedSize?.label,
      })),
      subtotal,
      discount,
      shipping: shippingCost,
      tax,
      total,
      appliedCoupon: appliedCoupon || undefined,
      status: 'processing',
      paymentMethod:
        payment.method === 'card'
          ? `Credit Card (ending in ${payment.cardNumber?.slice(-4) || '4242'})`
          : payment.method === 'upi'
          ? 'UPI Instant Settlement'
          : 'Cash / Card on Delivery',
      estimatedDelivery: 'Dispatches within 24 hours (Est. 3-4 business days)',
      trackingNumber,
    };

    addOrder(newOrder);
    clearCart();
    setIsProcessing(false);
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="text-center space-y-5 max-w-sm">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Authorizing Studio Order</h3>
              <p className="text-xs text-zinc-400 mt-2 font-mono transition-all">{processingStage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Encrypted Checkout
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
            Review & Finalize Order
          </h1>
        </div>
        <Link
          to="/cart"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Steps Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Indicator */}
          <div className="grid grid-cols-3 gap-3 text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-colors ${
                currentStep === 1
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Address</span>
            </button>

            <button
              onClick={() => {
                if (validateAddress()) setCurrentStep(2);
              }}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-colors ${
                currentStep === 2
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Shipping</span>
            </button>

            <button
              onClick={() => {
                if (validateAddress()) setCurrentStep(3);
              }}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-colors ${
                currentStep === 3
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Payment</span>
            </button>
          </div>

          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Step 1: Shipping & Recipient Details
                </h3>
              </div>

              <AddressForm address={address} onChange={setAddress} errors={addressErrors} />

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Shipping Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Shipping Tier */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Step 2: Select Delivery Speed
                </h3>
              </div>

              <div className="space-y-3">
                {/* Standard */}
                <label
                  onClick={() => setShippingTier('standard')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingTier === 'standard'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-zinc-900 dark:text-zinc-100 ring-1 ring-emerald-500'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h4 className="font-bold text-xs">Standard Freight Courier</h4>
                      <p className="text-[11px] text-zinc-500">Estimated delivery: 3-5 business days</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs">
                    {baseShipping === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(baseShipping)}
                  </span>
                </label>

                {/* Priority White Glove */}
                <label
                  onClick={() => setShippingTier('priority')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingTier === 'priority'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-zinc-900 dark:text-zinc-100 ring-1 ring-emerald-500'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-xs">Priority Air Express (Insured)</h4>
                      <p className="text-[11px] text-zinc-500">Dispatched within 6 hours • Next Day Arrival</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-amber-600 dark:text-amber-400">$25.00</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Step 3: Secure Payment Selection
                </h3>
              </div>

              <PaymentForm payment={payment} onChange={setPayment} errors={paymentErrors} />

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  ← Back to Shipping
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="py-3.5 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-xl shadow-emerald-600/25 flex items-center gap-2 group"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <OrderSummarySidebar shippingMethodCost={shippingCost} />
        </div>
      </div>
    </div>
  );
};
