'use client';

import { ModeToggle } from '@/components/Common/ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/lib/schemas/user';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg transition-all duration-300 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-600 transition-colors duration-200 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Snippet Vault
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <ModeToggle />
            {auth.user ? (
              <UserMenu onLogout={handleLogout} user={auth.user} />
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function UserMenu({ onLogout, user }: { onLogout: () => void; user: User }) {
  const initials = user.initials || '';
  const charCodeSum = initials
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const avatarIndex = charCodeSum % 70;
  const avatarUrl = `https://i.pravatar.cc/300?img=${avatarIndex}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 overflow-hidden rounded-full transition-all duration-200 hover:ring-2 hover:ring-purple-400"
        >
          <Avatar>
            <AvatarImage alt="User avatar" src={avatarUrl} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Link href="/profile" className="flex w-full items-center">
            <span className="mr-2">👤</span> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="flex w-full items-center">
            <span className="mr-2">⚙️</span> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-500 transition-colors duration-200 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
