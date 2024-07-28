import { Header } from '@/components/Layout/Header';

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
