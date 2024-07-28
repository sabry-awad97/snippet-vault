import { type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { enhancedButtonVariants } from './EnhancedButton';

interface EnhancedLinkProps
  extends VariantProps<typeof enhancedButtonVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

const motionVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const EnhancedLink: React.FC<EnhancedLinkProps> = ({
  href,
  children,
  variant,
  size,
  className,
  showArrow = false,
}) => {
  return (
    <motion.div variants={motionVariants} whileHover="hover" whileTap="tap">
      <Link
        href={href}
        passHref
        className={enhancedButtonVariants({ variant, size, className })}
      >
        {children}
        {showArrow && <ArrowRight className="ml-2 inline-block h-5 w-5" />}
      </Link>
    </motion.div>
  );
};

export default EnhancedLink;
