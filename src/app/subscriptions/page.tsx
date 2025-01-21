import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';
import { AddSubscriptionButton } from '@/components/subscriptions/AddSubscriptionButton';

export default async function SubscriptionsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Subscriptions</h1>
        <AddSubscriptionButton />
      </div>
      <SubscriptionList />
    </div>
  );
}
