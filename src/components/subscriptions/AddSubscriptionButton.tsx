"use client";

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { EditSubscriptionDialog } from './EditSubscriptionDialog';

export function AddSubscriptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Subscription
      </Button>
      <EditSubscriptionDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => setOpen(false)}
      />
    </>
  );
}
