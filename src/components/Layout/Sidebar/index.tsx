import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Folder,
  Home,
  LogOut,
  Moon,
  Settings,
  Share2,
  Sun,
  Tag,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const NavItem = ({ href, icon: Icon, children }: NavItemProps) => (
  <Link
    href={href}
    className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </Link>
);

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-4 shadow-lg transition-transform duration-200 ease-in-out dark:bg-gray-900 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Snippet Vault</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          <nav className="space-y-2">
            <NavItem href="/dashboard" icon={Home}>
              Dashboard
            </NavItem>
            <NavItem href="/collections" icon={Folder}>
              Collections
            </NavItem>
            <NavItem href="/tags" icon={Tag}>
              Tags
            </NavItem>
            <NavItem href="/shared" icon={Share2}>
              Shared Snippets
            </NavItem>
            <NavItem href="/settings" icon={Settings}>
              Settings
            </NavItem>
          </nav>
        </div>

        <div>
          <Separator className="my-4" />
          <div className="mb-4 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/path-to-user-image.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                john@example.com
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => console.log('Logout')}
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
