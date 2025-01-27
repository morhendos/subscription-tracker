"use client";

import { Plus } from 'lucide-react';

interface AddSubscriptionButtonProps {
  onClick: () => void;
}

export function AddSubscriptionButton({ onClick }: AddSubscriptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/15
        py-3 px-6 rounded-md transition-all duration-200
        flex items-center justify-center gap-2 group
        dark:text-blue-400 dark:hover:bg-blue-400/15"
    >
      <Plus size={18} className="group-hover:scale-105 transition-transform" strokeWidth={1.5} />
      Add Subscription
    </button>
  );
}
