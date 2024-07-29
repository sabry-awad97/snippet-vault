import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const hoverAnimation = {
  whileHover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  whileTap: { scale: 0.95, transition: { type: 'spring', stiffness: 300 } },
};

export const NavItem: React.FC<{
  item: NavItem;
  index: number;
  pathname: string;
}> = ({ item, index, pathname }) => (
  <motion.li
    variants={navItemVariants}
    custom={index}
    initial="hidden"
    animate="visible"
  >
    <Link href={item.href}>
      <motion.div
        className={cn(
          'flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200',
          'text-gray-700 hover:bg-purple-100 hover:text-purple-900',
          'dark:text-gray-200 dark:hover:bg-purple-800 dark:hover:text-purple-400',
          pathname === item.href &&
            'bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-300',
        )}
        {...hoverAnimation}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.label}</span>
      </motion.div>
    </Link>
  </motion.li>
);
