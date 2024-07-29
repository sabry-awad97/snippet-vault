import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { NavItem } from './NavItem';

const SidebarNav: React.FC<{
  navItems: NavItem[];
}> = ({ navItems }) => {
  const pathname = usePathname();

  return (
    <nav className="mt-8">
      <AnimatePresence>
        <motion.ul
          className="space-y-2 px-1"
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
};

export default SidebarNav;
