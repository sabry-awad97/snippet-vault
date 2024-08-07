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
import {
  Bell,
  ChevronDown,
  Code,
  Heart,
  MessageSquare,
  RefreshCw,
  Share2,
  Star,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

type NotificationType =
  | 'comment'
  | 'like'
  | 'update'
  | 'mention'
  | 'star'
  | 'share';

interface Notification {
  id: number;
  type: NotificationType;
  snippet: string;
  user: string;
  content?: string;
  timestamp: string;
  isNew: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'comment',
    snippet: 'React Hooks Advanced Usage',
    user: 'Alice Chen',
    content:
      'Brilliant implementation! Have you considered using useCallback for optimization?',
    timestamp: '2h ago',
    isNew: true,
    priority: 'high',
  },
  {
    id: 2,
    type: 'star',
    snippet: 'AI-Powered Code Refactoring',
    user: 'Bob Smith',
    timestamp: '4h ago',
    isNew: false,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'update',
    snippet: 'Vue 3 Composition API Tutorial',
    user: 'Eve Johnson',
    content: 'Major update: Now includes Suspense and Teleport examples',
    timestamp: '1d ago',
    isNew: false,
    priority: 'medium',
  },
  {
    id: 4,
    type: 'mention',
    snippet: 'GraphQL Best Practices',
    user: 'Charlie Brown',
    content:
      '@YourUsername Your input on schema design would be invaluable here.',
    timestamp: '2d ago',
    isNew: true,
    priority: 'high',
  },
  {
    id: 5,
    type: 'share',
    snippet: 'Quantum Computing in JavaScript',
    user: 'Diana Prince',
    timestamp: '3d ago',
    isNew: false,
    priority: 'low',
  },
];

const notificationVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  },
  exit: { opacity: 0, y: -20, scale: 0.8, transition: { duration: 0.2 } },
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

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const iconProps = { className: 'h-4 w-4' };
  switch (type) {
    case 'comment':
      return <MessageSquare {...iconProps} className="text-purple-500" />;
    case 'like':
      return <Heart {...iconProps} className="text-pink-500" />;
    case 'update':
      return <RefreshCw {...iconProps} className="text-indigo-500" />;
    case 'mention':
      return <User {...iconProps} className="text-blue-500" />;
    case 'star':
      return <Star {...iconProps} className="text-yellow-500" />;
    case 'share':
      return <Share2 {...iconProps} className="text-green-500" />;
    default:
      return <Bell {...iconProps} className="text-gray-500" />;
  }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => (
  <motion.div
    variants={notificationVariants}
    className={`rounded-md p-3 transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900 ${
      notification.isNew ? 'bg-purple-50 dark:bg-purple-800' : ''
    } ${
      notification.priority === 'high'
        ? 'border-l-4 border-red-500'
        : notification.priority === 'medium'
          ? 'border-l-4 border-yellow-500'
          : ''
    }`}
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
              : notification.type === 'update'
                ? 'updated'
                : notification.type === 'mention'
                  ? 'mentioned you in'
                  : notification.type === 'star'
                    ? 'starred'
                    : 'shared'}{' '}
          your snippet
          {notification.isNew && (
            <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-200 dark:text-purple-800">
              New
            </span>
          )}
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

const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  const count = notifications.length;
  const newCount = notifications.filter(n => n.isNew).length;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasNewNotifications(false);
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  }, [notifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now(),
        type: ['comment', 'like', 'update', 'mention', 'star', 'share'][
          Math.floor(Math.random() * 6)
        ] as NotificationType,
        snippet: 'New Cutting-Edge Snippet',
        user: 'Tech Innovator',
        content: 'This notification brings exciting news!',
        timestamp: 'Just now',
        isNew: true,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as
          | 'low'
          | 'medium'
          | 'high',
      };
      setNotifications(prev => [newNotification, ...prev]);
      setHasNewNotifications(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

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
                onClick={handleOpen}
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
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0 text-white"
                      >
                        {count}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                {hasNewNotifications && (
                  <motion.div
                    variants={pulseVariants}
                    animate="pulse"
                    className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"
                  />
                )}
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications Hub</p>
          </TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 mt-2 w-96 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-purple-500 ring-opacity-5 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-lg font-medium text-purple-900 dark:text-purple-100"
                  >
                    Notification Center
                    {newCount > 0 && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-400 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white">
                        {newCount} new
                      </span>
                    )}
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
                <ScrollArea className="h-[400px] pr-4">
                  <AnimatePresence>
                    {notifications.map(notification => (
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
                className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 text-center dark:from-purple-900 dark:to-pink-900"
              >
                <Button
                  variant="link"
                  size="sm"
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
                >
                  View all notifications
                  <ChevronDown className="ml-1 h-4 w-4" />
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
