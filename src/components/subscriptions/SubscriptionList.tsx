"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditSubscriptionDialog } from './EditSubscriptionDialog';
import { DeleteSubscriptionDialog } from './DeleteSubscriptionDialog';
import { getSubscriptions } from '@/lib/api';
import { Subscription } from '@/types/subscription';

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No subscriptions found. Add your first subscription to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{subscription.name}</h3>
              <p className="text-muted-foreground">
                {subscription.price} {subscription.currency} / {subscription.billingCycle.toLowerCase()}
              </p>
            </div>
            <div className="space-x-2">
              <EditSubscriptionDialog
                subscription={subscription}
                onSuccess={loadSubscriptions}
              />
              <DeleteSubscriptionDialog
                subscription={subscription}
                onSuccess={loadSubscriptions}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              Next billing: {format(new Date(subscription.nextBilling), 'PPP')}
            </p>
            {subscription.description && (
              <p className="text-sm text-muted-foreground">{subscription.description}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
