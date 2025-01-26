import { useState, useEffect } from 'react';
import { Subscription, SubscriptionFormData, SubscriptionSummary, Currency } from '@/types/subscriptions';
import { convertToEur } from '@/utils/format';

const STORAGE_KEY = 'subscriptions';

/**
 * Custom hook for managing subscription data with persistence
 * @returns {object} Subscription management methods and data
 * @property {Subscription[]} subscriptions - List of all subscriptions
 * @property {function} addSubscription - Add a new subscription
 * @property {function} updateSubscription - Update existing subscription
 * @property {function} deleteSubscription - Remove a subscription
 * @property {function} calculateSummary - Calculate spending summary
 * @property {boolean} mounted - Component mount status
 */
export function useSubscriptionStorage() {
  const [mounted, setMounted] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSubscriptions(parsed);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }, []);

  const addSubscription = (data: SubscriptionFormData): Subscription => {
    const newSubscription: Subscription = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextBillingDate: calculateNextBillingDate(data.startDate, data.billingPeriod)
    };

    setSubscriptions(current => {
      const newSubs = [...current, newSubscription];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubs));
      return newSubs;
    });
    return newSubscription;
  };

  const updateSubscription = (id: string, data: Partial<SubscriptionFormData>) => {
    setSubscriptions(current => {
      const updated = current.map(sub =>
        sub.id === id
          ? {
              ...sub,
              ...data,
              updatedAt: new Date().toISOString(),
              nextBillingDate: data.startDate || data.billingPeriod
                ? calculateNextBillingDate(data.startDate || sub.startDate, data.billingPeriod || sub.billingPeriod)
                : sub.nextBillingDate
            }
          : sub
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(current => {
      const filtered = current.filter(sub => sub.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  /**
   * Converts an amount from one period to another
   * @param amount - The amount to convert
   * @param fromPeriod - The source billing period
   * @param toPeriod - The target billing period
   * @returns The converted amount
   */
  const convertBetweenPeriods = (
    amount: number,
    fromPeriod: string,
    toPeriod: string
  ): number => {
    // First convert to monthly
    let monthlyAmount = amount;
    switch (fromPeriod) {
      case 'weekly':
        monthlyAmount = amount * 4.33; // Average weeks in a month
        break;
      case 'yearly':
        monthlyAmount = amount / 12;
        break;
      case 'quarterly':
        monthlyAmount = amount / 3;
        break;
    }

    // Then convert from monthly to target period
    switch (toPeriod) {
      case 'weekly':
        return monthlyAmount / 4.33;
      case 'yearly':
        return monthlyAmount * 12;
      case 'quarterly':
        return monthlyAmount * 3;
      default: // monthly
        return monthlyAmount;
    }
  };

  const calculateSummary = (): SubscriptionSummary => {
    const summary = subscriptions.reduce(
      (acc, sub) => {
        const priceInEur = convertToEur(sub.price, sub.currency || 'EUR');
        const currency = (sub.currency || 'EUR') as Currency;
        acc.originalAmounts[currency] = (acc.originalAmounts[currency] || 0) + sub.price;

        // Update period-specific totals
        switch (sub.billingPeriod) {
          case 'monthly':
            acc.totalMonthly += priceInEur;
            acc.totalWeekly += convertBetweenPeriods(priceInEur, 'monthly', 'weekly');
            acc.totalYearly += convertBetweenPeriods(priceInEur, 'monthly', 'yearly');
            acc.totalQuarterly += convertBetweenPeriods(priceInEur, 'monthly', 'quarterly');
            acc.grandTotalMonthly += priceInEur;
            break;
          case 'yearly':
            const monthlyFromYearly = priceInEur / 12;
            acc.totalMonthly += monthlyFromYearly;
            acc.totalWeekly += convertBetweenPeriods(monthlyFromYearly, 'monthly', 'weekly');
            acc.totalYearly += priceInEur;
            acc.totalQuarterly += convertBetweenPeriods(monthlyFromYearly, 'monthly', 'quarterly');
            acc.grandTotalMonthly += monthlyFromYearly;
            break;
          case 'weekly':
            const monthlyFromWeekly = priceInEur * 4.33;
            acc.totalMonthly += monthlyFromWeekly;
            acc.totalWeekly += priceInEur;
            acc.totalYearly += convertBetweenPeriods(monthlyFromWeekly, 'monthly', 'yearly');
            acc.totalQuarterly += convertBetweenPeriods(monthlyFromWeekly, 'monthly', 'quarterly');
            acc.grandTotalMonthly += monthlyFromWeekly;
            break;
          case 'quarterly':
            const monthlyFromQuarterly = priceInEur / 3;
            acc.totalMonthly += monthlyFromQuarterly;
            acc.totalWeekly += convertBetweenPeriods(monthlyFromQuarterly, 'monthly', 'weekly');
            acc.totalYearly += convertBetweenPeriods(monthlyFromQuarterly, 'monthly', 'yearly');
            acc.totalQuarterly += priceInEur;
            acc.grandTotalMonthly += monthlyFromQuarterly;
            break;
        }
        return acc;
      },
      {
        totalMonthly: 0,
        totalYearly: 0,
        totalWeekly: 0,
        totalQuarterly: 0,
        grandTotalMonthly: 0,
        originalAmounts: {
          EUR: 0,
          USD: 0,
          PLN: 0
        }
      }
    );

    return {
      ...summary,
      totalMonthly: Math.round(summary.totalMonthly * 100) / 100,
      totalYearly: Math.round(summary.totalYearly * 100) / 100,
      totalWeekly: Math.round(summary.totalWeekly * 100) / 100,
      totalQuarterly: Math.round(summary.totalQuarterly * 100) / 100,
      grandTotalMonthly: Math.round(summary.grandTotalMonthly * 100) / 100,
      originalAmounts: Object.fromEntries(
        Object.entries(summary.originalAmounts).map(([key, value]) => [
          key,
          Math.round(value * 100) / 100
        ])
      ) as Record<Currency, number>
    };
  };

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    calculateSummary,
    mounted
  };
}

/**
 * Calculate next billing date based on start date and billing period
 * @param startDate - Initial subscription date
 * @param billingPeriod - Billing frequency (weekly, monthly, etc)
 * @returns Next billing date as ISO string
 */
function calculateNextBillingDate(startDate: string, billingPeriod: string): string {
  const date = new Date(startDate);
  const today = new Date();
  
  if (date > today) {
    return date.toISOString();
  }

  const timeDiff = today.getTime() - date.getTime();
  let periodInMs: number;

  switch (billingPeriod) {
    case 'weekly':
      periodInMs = 7 * 24 * 60 * 60 * 1000;
      break;
    case 'monthly':
      periodInMs = 30 * 24 * 60 * 60 * 1000;
      break;
    case 'quarterly':
      periodInMs = 90 * 24 * 60 * 60 * 1000;
      break;
    case 'yearly':
      periodInMs = 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      return date.toISOString();
  }

  const periodsElapsed = Math.ceil(timeDiff / periodInMs);
  const nextBillingDate = new Date(date.getTime() + (periodsElapsed * periodInMs));

  return nextBillingDate.toISOString();
}