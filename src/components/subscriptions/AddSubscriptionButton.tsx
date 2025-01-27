'use client';

import { Plus } from 'lucide-react';

interface AddSubscriptionButtonProps {
  onClick: () => void;
}

export function AddSubscriptionButton({ onClick }: AddSubscriptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md bg-accent/10 p-4 transition-colors hover:bg-accent/15 flex items-center justify-center text-accent gap-2"
    >
      <Plus size={20} strokeWidth={1.5} />
      <span>Add Subscription</span>
    </button>
  );
}