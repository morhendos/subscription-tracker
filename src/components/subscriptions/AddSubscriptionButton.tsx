'use client';

import { Plus } from 'lucide-react';

interface AddSubscriptionButtonProps {
  onClick: () => void;
}

export function AddSubscriptionButton({ onClick }: AddSubscriptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-transparent bg-accent dark:bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 dark:hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent focus:ring-offset-2"
    >
      Add Subscription
    </button>
  );
}