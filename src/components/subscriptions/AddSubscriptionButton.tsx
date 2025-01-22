"use client";

import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { EditSubscriptionDialog } from './EditSubscriptionDialog';

export function AddSubscriptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 bg-accent/10 text-accent hover:bg-accent/15
          py-3 px-6 rounded-md transition-all duration-200
          flex items-center justify-center gap-2 group journal-text journal-button"
      >
        <PlusCircle className="mr-2 h-4 w-4 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
        Add Subscription
      </button>
      <EditSubscriptionDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => setOpen(false)}
      />
    </>
  );
}
