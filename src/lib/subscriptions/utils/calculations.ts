import { Subscription, SubscriptionSummary, Currency } from '@/types/subscriptions';
import { convertToEur } from '@/utils/format';
import { convertBetweenPeriods } from './periods';

export function calculateSummary(subscriptions: Subscription[]): SubscriptionSummary {
  const summary = subscriptions
    .filter(sub => !sub.disabled)
    .reduce(
      (acc, sub) => {
        const priceInEur = convertToEur(sub.price, sub.currency || 'EUR');
        const currency = (sub.currency || 'EUR') as Currency;
        acc.originalAmounts[currency] = (acc.originalAmounts[currency] || 0) + sub.price;

        const monthlyAmount = convertBetweenPeriods(priceInEur, sub.billingPeriod, 'monthly');
        
        acc.totalMonthly += monthlyAmount;
        acc.totalWeekly += convertBetweenPeriods(monthlyAmount, 'monthly', 'weekly');
        acc.totalYearly += convertBetweenPeriods(monthlyAmount, 'monthly', 'yearly');
        acc.totalQuarterly += convertBetweenPeriods(monthlyAmount, 'monthly', 'quarterly');
        acc.grandTotalMonthly += monthlyAmount;

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
}