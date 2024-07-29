import { Tooltip } from '@/components/Common/Tooltip';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Define the variant schema for buttons
const buttonVariants = cva(
  'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
  {
    variants: {
      color: {
        dark: 'border-purple-600 hover:bg-purple-800 hover:text-purple-200',
        light: 'border-purple-300 hover:bg-purple-100 hover:text-purple-800',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
      },
    },
    defaultVariants: {
      color: 'light',
    },
  },
);

const ActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
  isDestructive?: boolean;
  isDarkMode: boolean;
}> = ({ onClick, icon, tooltip, isDestructive, isDarkMode }) => (
  <Tooltip content={tooltip}>
    <Button
      variant={isDestructive ? 'destructive' : 'outline'}
      size="sm"
      onClick={onClick}
      className={buttonVariants({
        color: isDestructive ? 'destructive' : isDarkMode ? 'dark' : 'light',
      })}
    >
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        {icon}
      </motion.div>
    </Button>
  </Tooltip>
);

export default ActionButton;
