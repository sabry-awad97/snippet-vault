import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const NotificationButton = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative mr-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
    >
      <Bell className="h-6 w-6" />
      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
    </motion.button>
  );
};

export default NotificationButton;
