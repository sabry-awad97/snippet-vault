'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      router.push('/');
    }
  }, [auth.user, router]);

  return <div>{children}</div>;
}
