export type BillingPeriod = 'monthly' | 'yearly' | 'weekly' | 'quarterly';
export type Currency = 'EUR' | 'USD' | 'PLN';

export interface SubscriptionFormData {
  name: string;
  price: number;
  currency: Currency;
  billingPeriod: BillingPeriod;
  startDate: string;
  description?: string;
}

export interface Subscription extends SubscriptionFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  nextBillingDate: string;
}

export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  totalWeekly: number;
  totalQuarterly: number;
  grandTotalMonthly: number;
  originalAmounts: Record<Currency, number>;
}