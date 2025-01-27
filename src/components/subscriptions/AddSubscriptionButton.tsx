"use client";

import { Plus } from 'lucide-react';

interface AddSubscriptionButtonProps {
  onClick: () => void;
}

export function AddSubscriptionButton({ onClick }: AddSubscriptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-md bg-sky-400 hover:bg-sky-500 
        py-3 px-6 text-white font-medium transition-colors duration-200
        dark:bg-sky-600 dark:hover:bg-sky-700"
    >
      <Plus size={18} strokeWidth={1.5} />
      Add Subscription
    </button>
  );
}
