import { Subscription } from '@/types/subscriptions';

const STORAGE_KEY = 'subscriptions';

/**
 * Loads subscriptions from localStorage
 * @returns Array of subscriptions or undefined if not found
 */
export function loadSubscriptions(): Subscription[] | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return undefined;
  } catch (error) {
    console.error('Error loading subscriptions:', error);
    return undefined;
  }
}

/**
 * Saves subscriptions to localStorage
 * @param subscriptions - Array of subscriptions to save
 */
export function saveSubscriptions(subscriptions: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
}