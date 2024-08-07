import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Bell, Code, Heart, MessageSquare, RefreshCw, X } from 'lucide-react';
import React, { useState } from 'react';

// Define types
type NotificationType = 'comment' | 'like' | 'update';

interface Notification {
  id: number;
  type: NotificationType;
  snippet: string;
  user: string;
  content?: string;
  timestamp: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'comment',
    snippet: 'React Hooks Example',
    user: 'Alice',
    content: 'Great snippet! Very helpful.',
    timestamp: '2h ago',
  },
  {
    id: 2,
    type: 'like',
    snippet: 'Python Data Analysis',
    user: 'Bob',
    timestamp: '4h ago',
  },
  {
    id: 3,
    type: 'update',
    snippet: 'Vue.js Component',
    user: 'Eve',
    content: 'Updated to use Composition API',
    timestamp: '1d ago',
  },
  {
    id: 4,
    type: 'comment',
    snippet: 'CSS Grid Layout',
    user: 'Charlie',
    content: 'Could you explain the fr unit more?',
    timestamp: '2d ago',
  },
  {
    id: 5,
    type: 'like',
    snippet: 'JavaScript Promise Example',
    user: 'Diana',
    timestamp: '3d ago',
  },
];

// Animation variants
const notificationVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.8 },
};

const containerVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.07,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.9,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Component for notification icon
const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const iconProps = { className: 'h-4 w-4' };
  switch (type) {
    case 'comment':
      return <MessageSquare {...iconProps} className="text-purple-500" />;
    case 'like':
      return <Heart {...iconProps} className="text-pink-500" />;
    case 'update':
      return <RefreshCw {...iconProps} className="text-indigo-500" />;
    default:
      return <Bell {...iconProps} className="text-gray-500" />;
  }
};

// Component for individual notification item
const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => (
  <motion.div
    variants={notificationVariants}
    className="rounded-md p-3 transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
          {notification.user}{' '}
          {notification.type === 'like'
            ? 'liked'
            : notification.type === 'comment'
              ? 'commented on'
              : 'updated'}{' '}
          your snippet
        </p>
        <p className="mt-1 flex items-center text-xs text-purple-600 dark:text-purple-300">
          <Code className="mr-1 inline-block h-3 w-3" />
          {notification.snippet}
        </p>
        {notification.content && (
          <p className="mt-1 text-xs italic text-purple-700 dark:text-purple-200">
            &quot;{notification.content}&quot;
          </p>
        )}
        <p className="mt-1 text-xs text-purple-500 dark:text-purple-400">
          {notification.timestamp}
        </p>
      </div>
    </div>
  </motion.div>
);

// Main NotificationButton component
const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const count = mockNotifications.length;

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1"
                    >
                      <Badge
                        variant="destructive"
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 p-0 text-white"
                      >
                        {count}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-purple-500 ring-opacity-5 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-lg font-medium text-purple-900 dark:text-purple-100"
                  >
                    Notifications
                  </motion.h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[300px] pr-4">
                  <AnimatePresence>
                    {mockNotifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </AnimatePresence>
                </ScrollArea>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-purple-50 px-4 py-3 text-center dark:bg-purple-900"
              >
                <Button
                  variant="link"
                  size="sm"
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
                >
                  View all notifications
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default NotificationButton;
