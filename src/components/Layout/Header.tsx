import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const user = true;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-600 dark:text-purple-400"
            >
              Snippet Vault
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-4 md:flex">
            <NavLinks />
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="text-gray-600 dark:text-gray-300 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-2">
              <NavLinks />
              <ThemeToggle />
              {user ? (
                <Button variant="outline" onClick={() => {}}>
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLinks() {
  return (
    <>
      <Link
        href="/dashboard"
        className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
      >
        Dashboard
      </Link>
      <Link
        href="/snippets"
        className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
      >
        Snippets
      </Link>
      <Link
        href="/collections"
        className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
      >
        Collections
      </Link>
    </>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useCurrentTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              alt="User avatar"
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
