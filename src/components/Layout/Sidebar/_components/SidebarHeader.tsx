import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import DefaultLogo from './DefaultLogo';

const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.1, rotate: 90 },
  tap: { scale: 0.9, rotate: 45 },
};

const SidebarHeader: React.FC<{
  toggleSidebar: () => void;
}> = ({ toggleSidebar }) => (
  <div className="flex items-center justify-between">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={logoVariants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <DefaultLogo />
    </motion.div>
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden"
      >
        <X className="h-6 w-6" />
      </Button>
    </motion.div>
  </div>
);

export default SidebarHeader;
