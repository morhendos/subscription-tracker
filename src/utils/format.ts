import { Currency } from '@/types/subscriptions';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  PLN: 'zł'
};

const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 0.85, // Example rate: 1 USD = 0.85 EUR
  PLN: 0.22  // Example rate: 1 PLN = 0.22 EUR
};

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${CURRENCY_SYMBOLS[currency]}${formatter.format(amount)}`;
}

export function convertToEur(amount: number, fromCurrency: Currency): number {
  return amount * EXCHANGE_RATES[fromCurrency];
}
