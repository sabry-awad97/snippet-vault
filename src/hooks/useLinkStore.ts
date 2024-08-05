import { Grid2X2, Heart, LogOut, LucideIcon, Tags, Trash } from 'lucide-react';
import { create } from 'zustand';

type QuickLink =
  | {
      type: 'LINK';
      link: {
        id: 'all' | 'favorites' | 'trash' | 'tags' | 'logout';
        icon: LucideIcon;
        label: string;
      };
    }
  | { type: 'SEPARATOR' }
  | { type: 'EMPTY' };

interface LinkState {
  links: QuickLink[];
}

export const useLinkStore = create<LinkState>()(set => ({
  links: [
    {
      type: 'LINK',
      link: {
        id: 'all',
        icon: Grid2X2,
        label: 'All Snippets',
      },
    },
    {
      type: 'LINK',
      link: {
        id: 'favorites',
        icon: Heart,
        label: 'Favorites',
      },
    },
    {
      type: 'LINK',
      link: {
        id: 'trash',
        icon: Trash,
        label: 'Trash',
      },
    },
    { type: 'EMPTY' },
    { type: 'SEPARATOR' },
    {
      type: 'LINK',
      link: {
        id: 'tags',
        icon: Tags,
        label: 'Tags',
      },
    },
    {
      type: 'LINK',
      link: {
        id: 'logout',
        icon: LogOut,
        label: 'Logout',
      },
    },
  ],
}));
