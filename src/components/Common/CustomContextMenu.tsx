import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { FileIcon, FolderIcon, TrashIcon } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';

export interface ContextMenuItemType {
  label: string;
  icon?: ReactNode;
  action?: () => void;
  submenu?: ContextMenuItemType[];
  disabled?: boolean;
}

interface CustomContextMenuProps {
  items: ContextMenuItemType[];
  triggerComponent: ReactNode;
  className?: string;
}

const menuItems = [
  {
    label: 'New',
    icon: <FileIcon className="h-4 w-4" />,
    submenu: [
      { label: 'File', action: () => console.log('New file') },
      { label: 'Folder', action: () => console.log('New folder') },
    ],
  },
  {
    label: 'Open',
    icon: <FolderIcon className="h-4 w-4" />,
    action: () => console.log('Open'),
  },
  {
    label: 'Delete',
    icon: <TrashIcon className="h-4 w-4" />,
    action: () => console.log('Delete'),
    disabled: true,
  },
];

export const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  items,
  triggerComponent,
  className,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu as any);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu as any);
    };
  }, []);

  const renderMenuItem = (item: ContextMenuItemType) => {
    if (item.submenu) {
      return (
        <ContextMenuSub key={item.label}>
          <ContextMenuSubTrigger className="flex items-center">
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {item.submenu.map(renderMenuItem)}
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }

    return (
      <ContextMenuItem
        key={item.label}
        onClick={item.action}
        disabled={item.disabled}
        className="flex items-center"
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
      </ContextMenuItem>
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{triggerComponent}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn('w-64', className)}
        style={{
          position: 'absolute',
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {renderMenuItem(item)}
            {index < items.length - 1 && <ContextMenuSeparator />}
          </React.Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};
