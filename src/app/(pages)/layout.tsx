import ThemeSwitch from '@/components/Common/ThemeSwitch';

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {children}
      <div className="absolute bottom-8 right-8">
        <div className="flex transform items-center justify-center rounded-full bg-white p-3 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800 dark:shadow-indigo-500/20">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}
