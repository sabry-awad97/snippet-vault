import { useAuth } from '@/hooks/useAuth';
import { useLinkStore } from '@/hooks/useLinkStore';
import useSnippetsContext from '@/hooks/useSnippetsContext';
import useTagsContext from '@/hooks/useTagsContext';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

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

const quickLinkStyles = cva(
  'flex cursor-pointer select-none w-[80%] items-center gap-1 rounded-md p-2',
  {
    variants: {
      state: {
        default: 'bg-purple-600 text-white',
        hover: 'hover:bg-purple-600 hover:text-white',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

const SidebarNav: React.FC<{}> = ({}) => {
  const { links, setSelectedLink } = useLinkStore();
  const { handleFavoriteToggle, clearFilters } = useSnippetsContext();
  const { setIsTagsDialogOpen } = useTagsContext();

  const auth = useAuth();
  const router = useRouter();

  type LinkType = (typeof links)[number];
  type ExtractId<T> = T extends { type: 'LINK'; link: { id: infer U } }
    ? U
    : never;
  type LinkIds = ExtractId<LinkType>;

  const handleLogout = useCallback(async () => {
    try {
      await auth.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [auth, router]);

  const createOnClickHandler = useCallback(
    (id: LinkIds) => {
      return () => {
        setSelectedLink(id);

        switch (id) {
          case 'all':
            clearFilters();
            break;
          case 'favorites':
            handleFavoriteToggle(true);
            break;
          case 'trash':
            break;
          case 'tags':
            setIsTagsDialogOpen(true);
            break;
          case 'logout':
            handleLogout();
            break;
          default:
            break;
        }
      };
    },
    [
      setSelectedLink,
      handleLogout,
      handleFavoriteToggle,
      clearFilters,
      setIsTagsDialogOpen,
    ],
  );

  return (
    <nav className="mt-20 text-sm">
      <div className="font-semibold text-slate-400">Quick Links</div>
      <AnimatePresence>
        <motion.ul
          className="mt-4 flex flex-col gap-2 px-1 text-slate-400"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {links.map((item, index) => {
            switch (item.type) {
              case 'LINK':
                const { id, icon: Icon, label, selected } = item.link;
                return (
                  <motion.li
                    key={label}
                    variants={navItemVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className={cn(
                        quickLinkStyles({
                          state: selected ? 'default' : 'hover',
                        }),
                      )}
                      onClick={createOnClickHandler(id)}
                      {...hoverAnimation}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </motion.div>
                  </motion.li>
                );

              case 'EMPTY':
                return <motion.li key={index} className="h-4" />;

              default:
                return null;
            }
          })}
        </motion.ul>
      </AnimatePresence>
    </nav>
  );
};

export default SidebarNav;
