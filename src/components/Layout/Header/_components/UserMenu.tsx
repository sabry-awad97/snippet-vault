'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu({ onLogout }: { onLogout: () => void }) {
  const auth = useAuth();

  const initials = auth.user?.initials || '';
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
            <AvatarFallback>{auth.user?.initials}</AvatarFallback>
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
