"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription';
import { deleteSubscription } from '@/lib/api';

interface DeleteSubscriptionDialogProps {
  subscription: Subscription;
  onSuccess: () => void;
}

export function DeleteSubscriptionDialog({
  subscription,
  onSuccess,
}: DeleteSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSubscription(subscription.id);
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subscription</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {subscription.name}?</p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
