import { Tooltip } from '@/components/Common/Tooltip';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import React from 'react';

// Define the button variant schema
const buttonVariants = cva(
  'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      color: {
        dark: 'bg-purple-700 text-white border-purple-600 hover:bg-purple-800 focus:ring-purple-500',
        light:
          'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 focus:ring-purple-400',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      color: 'light',
      size: 'md',
    },
  },
);

// Define props interface
interface ActionButtonProps extends VariantProps<typeof buttonVariants> {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
  isDestructive?: boolean;
  isDarkMode?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  tooltip,
  isDestructive = false,
  isDarkMode = false,
  size,
}) => {
  const buttonColor = isDestructive
    ? 'destructive'
    : isDarkMode
      ? 'dark'
      : 'light';

  return (
    <Tooltip content={tooltip}>
      <Button
        variant="outline"
        onClick={onClick}
        className={buttonVariants({ color: buttonColor, size })}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {icon}
        </motion.div>
      </Button>
    </Tooltip>
  );
};

export default ActionButton;
