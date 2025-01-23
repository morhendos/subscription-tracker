'use client';

import { useState } from 'react';
import { Subscription, SubscriptionFormData } from '@/types/subscriptions';
import { getLocalISOString } from '@/utils/dates';

export function SubscriptionForm({ 
  onSubmit,
  onCancel,
  initialData 
}: { 
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel?: () => void;
  initialData?: Subscription;
}) {
  const [form, setForm] = useState<SubscriptionFormData>({
    name: initialData?.name || '',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'EUR',
    billingPeriod: initialData?.billingPeriod || 'monthly',
    startDate: initialData?.startDate || getLocalISOString(new Date()),
    description: initialData?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    
    if (!initialData) {
      setForm({
        name: '',
        price: 0,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: getLocalISOString(new Date()),
        description: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Netflix, Spotify, etc."
          required
          className="input-base"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-foreground">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-foreground">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="input-base"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="PLN">PLN</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="billingPeriod" className="block text-sm font-medium text-foreground">
            Billing Period
          </label>
          <select
            id="billingPeriod"
            name="billingPeriod"
            value={form.billingPeriod}
            onChange={handleChange}
            className="input-base"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-foreground">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="input-base"
          placeholder="Add any notes about this subscription..."
        />
      </div>

      <div className="flex justify-end space-x-4 p-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="button-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="button-primary"
        >
          {initialData ? 'Update' : 'Add'} Subscription
        </button>
      </div>
    </form>
  );
}