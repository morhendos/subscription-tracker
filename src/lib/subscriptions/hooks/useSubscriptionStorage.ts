import { useState, useEffect } from 'react';
import { Subscription, SubscriptionFormData } from '@/types/subscriptions';
import { calculateNextBillingDate } from '../utils/dates';
import { calculateSummary } from '../utils/calculations';
import { loadSubscriptions, saveSubscriptions } from '../storage/localStorage';

/**
 * Custom hook for managing subscription data with persistence
 * @returns {object} Subscription management methods and data
 */
export function useSubscriptionStorage() {
  const [mounted, setMounted] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    setMounted(true);
    const storedSubs = loadSubscriptions();
    if (storedSubs) {
      setSubscriptions(storedSubs);
    }
  }, []);

  const addSubscription = (data: SubscriptionFormData): Subscription => {
    const newSubscription: Subscription = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextBillingDate: calculateNextBillingDate(data.startDate, data.billingPeriod),
      disabled: false
    };

    setSubscriptions(current => {
      const newSubs = [...current, newSubscription];
      saveSubscriptions(newSubs);
      return newSubs;
    });
    return newSubscription;
  };

  const updateSubscription = (id: string, data: Partial<SubscriptionFormData>) => {
    setSubscriptions(current => {
      const updated = current.map(sub => {
        if (sub.id !== id) return sub;

        // Preserve existing values and merge with updates
        const updatedSub = {
          ...sub,
          ...data,
          description: data.description ?? sub.description, // Preserve description if not provided
          updatedAt: new Date().toISOString(),
        };

        // Update nextBillingDate if startDate or billingPeriod changed
        if (data.startDate || data.billingPeriod) {
          updatedSub.nextBillingDate = calculateNextBillingDate(
            data.startDate || sub.startDate,
            data.billingPeriod || sub.billingPeriod
          );
        }

        return updatedSub;
      });

      saveSubscriptions(updated);
      return updated;
    });
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(current => {
      const updated = current.map(sub =>
        sub.id === id
          ? { ...sub, disabled: !sub.disabled, updatedAt: new Date().toISOString() }
          : sub
      );
      saveSubscriptions(updated);
      return updated;
    });
  };

  const toggleAllSubscriptions = (enabled: boolean) => {
    setSubscriptions(current => {
      const updated = current.map(sub => ({
        ...sub,
        disabled: !enabled,
        updatedAt: new Date().toISOString()
      }));
      saveSubscriptions(updated);
      return updated;
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(current => {
      const filtered = current.filter(sub => sub.id !== id);
      saveSubscriptions(filtered);
      return filtered;
    });
  };

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscription,
    toggleAllSubscriptions,
    calculateSummary: () => calculateSummary(subscriptions),
    mounted
  };
}