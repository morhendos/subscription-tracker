"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Subscription } from '@/types/subscription';
import { subscriptionSchema } from '@/lib/validations/subscription';
import { createSubscription, updateSubscription } from '@/lib/api';

type FormData = Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

interface EditSubscriptionDialogProps {
  subscription?: Subscription;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
  onSuccess,
}: EditSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription ?? {
      name: '',
      price: 0,
      currency: 'USD',
      billingCycle: 'MONTHLY',
      startDate: new Date(),
      nextBilling: new Date(),
      description: '',
      status: 'ACTIVE',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (subscription) {
        await updateSubscription(subscription.id, data);
      } else {
        await createSubscription(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Edit Subscription' : 'Add Subscription'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              error={form.formState.errors.name?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                error={form.formState.errors.price?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                {...form.register('currency')}
                className="w-full p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <select
              id="billingCycle"
              {...form.register('billingCycle')}
              className="w-full p-2 border rounded"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              {...form.register('description')}
              error={form.formState.errors.description?.message}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {subscription ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
