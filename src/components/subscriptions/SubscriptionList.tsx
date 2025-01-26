'use client';

import { useMemo } from 'react';
import { Subscription } from '@/types/subscriptions';
import { formatCurrency } from '@/utils/format';
import { Pencil, Trash, CreditCard } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  // Ensure subscriptions is always an array
  const items = subscriptions || [];
  
  const sortedSubscriptions = useMemo(() => {
    return [...items].sort((a, b) => {
      const nextDateA = new Date(a.nextBillingDate || a.startDate);
      const nextDateB = new Date(b.nextBillingDate || b.startDate);
      return nextDateA.getTime() - nextDateB.getTime();
    });
  }, [items]);

  // Return early for empty state
  if (!items.length) {
    return <div className="text-center text-muted italic py-8">No subscriptions added yet</div>;
  }

  return (
    <div className="space-y-4">
      {sortedSubscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="bg-paper p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-accent dark:text-accent/90">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {subscription.name}
                </h3>
                
                <div className="mt-1 text-muted text-sm">
                  {formatCurrency(subscription.price, subscription.currency)} per {subscription.billingPeriod}
                </div>

                {subscription.description && (
                  <div className="mt-2 text-sm text-muted">
                    {subscription.description}
                  </div>
                )}

                <div className="mt-2 text-xs text-muted">
                  Next billing: {new Date(subscription.nextBillingDate || subscription.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(subscription)}
                className="p-2 text-muted hover:text-foreground transition-colors"
                title="Edit subscription"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(subscription.id)}
                className="p-2 text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Delete subscription"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}