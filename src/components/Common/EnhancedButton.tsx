import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';

export const enhancedButtonVariants = cva(
  'px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:-translate-y-1',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl focus:ring-purple-500',
        secondary:
          'text-purple-600 bg-transparent border-2 border-purple-600 hover:text-white hover:bg-purple-600 hover:shadow-lg focus:ring-purple-500',
        tertiary:
          'text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl focus:ring-purple-500',
      },
      size: {
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

interface EnhancedButtonProps
  extends VariantProps<typeof enhancedButtonVariants>,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | 'variant'
      | 'size'
      | 'onAnimationStart'
      | 'onDragStart'
      | 'onDragEnd'
      | 'onDrag'
    > {
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

const motionVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant,
  size,
  className,
  showArrow = false,
  onClick,
  ...props
}) => {
  return (
    <motion.button
      variants={motionVariants}
      whileHover="hover"
      whileTap="tap"
      className={enhancedButtonVariants({ variant, size, className })}
      onClick={onClick}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight className="ml-2 inline-block h-5 w-5" />}
    </motion.button>
  );
};

export default EnhancedButton;
