'use client';

import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      {!isHomePage && <Header />}
      <main
        className={cn('flex-grow', {
          'container mx-auto px-4 py-8': !isHomePage,
        })}
      >
        {children}
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}
