'use client';

import { useState } from 'react';
import { BillingPeriod, Currency, SubscriptionFormData } from '@/types/subscriptions';
import { Save, Plus } from 'lucide-react';

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<SubscriptionFormData>;
  submitLabel?: string;
}

const BILLING_PERIODS: { value: BillingPeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Quarterly' }
];

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'PLN', label: 'PLN (zł)' }
];

export function SubscriptionForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Add Subscription'
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: initialData?.name || '',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'EUR',
    billingPeriod: initialData?.billingPeriod || 'monthly',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    description: initialData?.description || ''
  });

  // Keep track of price input value as string to allow for partial input like decimal points
  const [priceInput, setPriceInput] = useState(formData.price.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = parseFloat(priceInput) || 0;
    onSubmit({ ...formData, price: finalPrice });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceInput(value);
    
    // Only update the formData if we have a valid number
    if (value && !isNaN(parseFloat(value))) {
      setFormData(prev => ({ ...prev, price: parseFloat(value) }));
    }
  };

  const inputWrapperClassName = "relative mt-1 p-[5px]";
  const inputClassName = "w-full rounded-md border border-input bg-paper px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink/90 journal-text">
          Service Name
        </label>
        <div className={inputWrapperClassName}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className={inputClassName}
            placeholder="Netflix, Spotify, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink/90 journal-text">
            Price
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className={inputWrapperClassName}>
              <input
                type="text"
                pattern="^\d*\.?\d*$"
                value={priceInput}
                onChange={handlePriceChange}
                required
                min="0"
                placeholder="0.00"
                className={inputClassName}
              />
            </div>
            <div className={inputWrapperClassName}>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                required
                className={inputClassName}
              >
                {CURRENCIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink/90 journal-text">
            Billing Period
          </label>
          <div className={inputWrapperClassName}>
            <select
              value={formData.billingPeriod}
              onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value as BillingPeriod })}
              required
              className={inputClassName}
            >
              {BILLING_PERIODS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink/90 journal-text">
          Start Date
        </label>
        <div className={inputWrapperClassName}>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink/90 journal-text">
          Description (Optional)
        </label>
        <div className={inputWrapperClassName}>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`min-h-[80px] ${inputClassName}`}
            placeholder="Add any notes about this subscription..."
          />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-paper text-ink/70 hover:text-ink
              py-3 px-6 rounded-md transition-all duration-200 
              flex items-center justify-center gap-2 group journal-text journal-button"
          >
            <span>Cancel</span>
          </button>
        )}
        <button 
          type="submit"
          className="flex-1 bg-accent/10 text-accent hover:bg-accent/15
            py-3 px-6 rounded-md transition-all duration-200
            flex items-center justify-center gap-2 group journal-text journal-button"
        >
          {initialData ? (
            <>
              <Save size={18} className="group-hover:scale-105 transition-transform" strokeWidth={1.5} />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Plus size={18} className="group-hover:scale-105 transition-transform" strokeWidth={1.5} />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
