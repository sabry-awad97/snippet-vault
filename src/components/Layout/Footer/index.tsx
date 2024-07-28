import ConnectWithUs from './ConnectWithUs';
import CopyrightNotice from './CopyrightNotice';
import FooterSection from './FooterSection';
import QuickLinks from './QuickLinks';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FooterSection
            title="Snippet Vault"
            description="Organize, share, and collaborate on your code snippets with ease."
          />
          <QuickLinks />
          <ConnectWithUs />
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
          <CopyrightNotice />
        </div>
      </div>
    </footer>
  );
}
