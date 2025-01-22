import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Subscription, SubscriptionFormData, SubscriptionSummary, Currency } from '@/types/subscriptions';
import { convertToEur } from '@/utils/format';

const STORAGE_KEY = 'subscriptions';

function migrateSubscriptions(subscriptions: any[]): Subscription[] {
  return subscriptions.map(sub => ({
    ...sub,
    currency: sub.currency || 'EUR' // Default old subscriptions to EUR
  }));
}

export function useSubscriptionStorage() {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>(STORAGE_KEY, [], {
    deserialize: (value) => {
      const parsed = JSON.parse(value);
      return migrateSubscriptions(parsed);
    }
  });

  const addSubscription = (data: SubscriptionFormData): Subscription => {
    const newSubscription: Subscription = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextBillingDate: calculateNextBillingDate(data.startDate, data.billingPeriod)
    };

    setSubscriptions(current => [...current, newSubscription]);
    return newSubscription;
  };

  const updateSubscription = (id: string, data: Partial<SubscriptionFormData>) => {
    setSubscriptions(current =>
      current.map(sub =>
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
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(current => current.filter(sub => sub.id !== id));
  };

  const calculateSummary = (): SubscriptionSummary => {
    const summary = subscriptions.reduce(
      (acc, sub) => {
        const priceInEur = convertToEur(sub.price, sub.currency || 'EUR');

        // Track original currency amounts
        const currency = (sub.currency || 'EUR') as Currency;
        acc.originalAmounts[currency] = (acc.originalAmounts[currency] || 0) + sub.price;

        switch (sub.billingPeriod) {
          case 'monthly':
            acc.totalMonthly += priceInEur;
            acc.grandTotalMonthly += priceInEur;
            break;
          case 'yearly':
            acc.totalYearly += priceInEur;
            acc.grandTotalMonthly += priceInEur / 12;
            break;
          case 'weekly':
            acc.totalWeekly += priceInEur;
            acc.grandTotalMonthly += priceInEur * 4.33; // Average weeks per month
            break;
          case 'quarterly':
            acc.totalQuarterly += priceInEur;
            acc.grandTotalMonthly += priceInEur / 3;
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

    // Round all values to 2 decimal places
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
    calculateSummary
  };
}

function calculateNextBillingDate(startDate: string, billingPeriod: string): string {
  const date = new Date(startDate);
  const today = new Date();
  
  // If start date is in the future, that's the next billing date
  if (date > today) {
    return date.toISOString();
  }

  // Calculate how many periods have passed
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