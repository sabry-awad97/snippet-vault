import { AnimatePresence, motion } from 'framer-motion';
import { NavItem } from './NavItem';

const SidebarNav: React.FC<{
  navItems: NavItem[];
  pathname: string;
}> = ({ navItems, pathname }) => (
  <nav className="mt-8">
    <AnimatePresence>
      <motion.ul
        className="space-y-2 px-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          visible: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {navItems.map((item, index) => (
          <NavItem
            key={item.href}
            item={item}
            index={index}
            pathname={pathname}
          />
        ))}
      </motion.ul>
    </AnimatePresence>
  </nav>
);

export default SidebarNav;
