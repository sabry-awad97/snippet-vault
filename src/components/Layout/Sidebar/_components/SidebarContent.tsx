import { motion } from 'framer-motion';
import { NavItem } from './NavItem';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';

const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: '-100%', opacity: 0 },
};

const SidebarContent: React.FC<{
  logo?: React.ReactNode;
  navItems: NavItem[];
  toggleSidebar: () => void;
  pathname: string;
}> = ({ logo, navItems, toggleSidebar, pathname }) => (
  <motion.aside
    initial="closed"
    animate="open"
    exit="closed"
    variants={sidebarVariants}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white p-6 shadow-lg dark:bg-gray-800 md:relative"
  >
    <SidebarHeader logo={logo} toggleSidebar={toggleSidebar} />
    <SidebarNav navItems={navItems} pathname={pathname} />
  </motion.aside>
);

export default SidebarContent;
