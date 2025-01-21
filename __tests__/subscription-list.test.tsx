import { render, screen } from '@testing-library/react';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';

describe('SubscriptionList', () => {
  it('shows loading state', () => {
    render(<SubscriptionList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    render(<SubscriptionList />);
    const emptyMessage = await screen.findByText(/No subscriptions found/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});
