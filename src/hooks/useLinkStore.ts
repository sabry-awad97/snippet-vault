import { Grid2X2, Heart, LogOut, LucideIcon, Tags, Trash } from 'lucide-react';
import { create } from 'zustand';

type QuickLink =
  | {
      type: 'LINK';
      link: {
        id: 'all' | 'favorites' | 'trash' | 'tags' | 'logout';
        icon: LucideIcon;
        label: string;
        selected: boolean;
      };
    }
  | { type: 'SEPARATOR' }
  | { type: 'EMPTY' };

interface LinkState {
  links: QuickLink[];
  setSelectedLink: (id: string) => void;
  resetLinks: () => void;
}

export const useLinkStore = create<LinkState>()(set => ({
  links: [
    {
      type: 'LINK',
      link: {
        id: 'all',
        icon: Grid2X2,
        label: 'All Snippets',
        selected: true,
      },
    },
    {
      type: 'LINK',
      link: {
        id: 'favorites',
        icon: Heart,
        label: 'Favorites',
        selected: false,
      },
    },
    {
      type: 'LINK',
      link: {
        id: 'trash',
        icon: Trash,
        label: 'Trash',
        selected: false,
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
        selected: false,
      },
    },
    {
      type: 'LINK',
      link: {
        id: 'logout',
        icon: LogOut,
        label: 'Logout',
        selected: false,
      },
    },
  ],
  setSelectedLink: id =>
    set(state => ({
      links: state.links.map(item =>
        item.type === 'LINK'
          ? {
              ...item,
              link: {
                ...item.link,
                selected: item.link.id === id,
              },
            }
          : item,
      ),
    })),
  resetLinks: () =>
    set(state => ({
      links: state.links.map(item =>
        item.type === 'LINK'
          ? {
              ...item,
              link: {
                ...item.link,
                selected: false,
              },
            }
          : item,
      ),
    })),
}));
