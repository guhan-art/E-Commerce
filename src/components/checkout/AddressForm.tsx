import React from 'react';
import { ShippingAddress } from '../../types';
import { User, Mail, Phone, MapPin, Building, Globe } from 'lucide-react';

interface AddressFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  errors: Partial<Record<keyof ShippingAddress, string>>;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, errors }) => {
  const handleChange = (field: keyof ShippingAddress, val: string) => {
    onChange({
      ...address,
      [field]: val,
    });
  };

  return (
    <div className="space-y-4">
      {/* Full Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            Recipient Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={address.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Guhan Raj"
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-500 focus:ring-rose-500/40'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            Email for Order Receipt *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="email"
              value={address.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="guhan@example.com"
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500/40'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
          Phone Number for Courier Dispatch *
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
              errors.phone
                ? 'border-rose-500 focus:ring-rose-500/40'
                : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
            }`}
          />
        </div>
        {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
      </div>

      {/* Street & Apartment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            Street Address *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="742 Evergreen Terrace"
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
                errors.street
                  ? 'border-rose-500 focus:ring-rose-500/40'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
              }`}
            />
          </div>
          {errors.street && <p className="text-[11px] text-rose-500 mt-1">{errors.street}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            Apt, Suite, Unit
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={address.apartment || ''}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="Suite 4B"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* City, State, Zip, Country */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            City *
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="San Francisco"
            className={`w-full px-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
              errors.city
                ? 'border-rose-500 focus:ring-rose-500/40'
                : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
            }`}
          />
          {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            State / Province *
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="California"
            className={`w-full px-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
              errors.state
                ? 'border-rose-500 focus:ring-rose-500/40'
                : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
            }`}
          />
          {errors.state && <p className="text-[11px] text-rose-500 mt-1">{errors.state}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
            Postal / Zip Code *
          </label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="94107"
            className={`w-full px-3 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
              errors.postalCode
                ? 'border-rose-500 focus:ring-rose-500/40'
                : 'border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500/50'
            }`}
          />
          {errors.postalCode && <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>}
        </div>
      </div>
    </div>
  );
};
