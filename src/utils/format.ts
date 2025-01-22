import { Currency } from '@/types/subscriptions';

const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 0.85, // Example rate: 1 USD = 0.85 EUR
  PLN: 0.22  // Example rate: 1 PLN = 0.22 EUR
};

export function convertToEur(amount: number, fromCurrency: Currency): number {
  return amount * EXCHANGE_RATES[fromCurrency];
}