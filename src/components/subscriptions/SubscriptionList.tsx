'use client';

import { Subscription, Currency } from '@/types/subscriptions';
import { useState } from 'react';
import { CreditCard, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatBillingPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  const formatNextBilling = (date: string | undefined) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="bg-paper border border-border rounded-lg p-4 space-y-4 transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard size={18} className="text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-medium journal-text">{subscription.name}</h3>
                <p className="text-sm text-ink/60">
                  {formatCurrency(subscription.price, subscription.currency)} / {formatBillingPeriod(subscription.billingPeriod)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(subscription)}
                className="p-2 hover:bg-accent/10 rounded-md transition-colors"
              >
                <Edit2 size={16} className="text-accent" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => handleDelete(subscription.id)}
                className="p-2 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <Trash2 size={16} className="text-red-500" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => toggleExpand(subscription.id)}
                className="p-2 hover:bg-accent/10 rounded-md transition-colors"
              >
                <MoreVertical size={16} className="text-accent" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {expandedId === subscription.id && (
            <div className="text-sm space-y-2 pt-2 border-t border-border/50">
              <p><span className="text-ink/60">Started on:</span> {new Date(subscription.startDate).toLocaleDateString()}</p>
              <p><span className="text-ink/60">Next billing:</span> {formatNextBilling(subscription.nextBillingDate)}</p>
              {subscription.description && (
                <p><span className="text-ink/60">Notes:</span> {subscription.description}</p>
              )}
            </div>
          )}
        </div>
      ))}

      {subscriptions.length === 0 && (
        <div className="text-center py-8 text-ink/60">
          <p>No subscriptions added yet</p>
        </div>
      )}
    </div>
  );
}