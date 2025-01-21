import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect('/subscriptions');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your subscriptions
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
