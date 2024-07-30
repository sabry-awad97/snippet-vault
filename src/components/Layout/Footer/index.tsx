import ThemeSwitch from '@/components/Common/ThemeSwitch';
import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Footer = () => {
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-lg bg-white p-2 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:shadow-indigo-500/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
          </motion.div>

          <ThemeSwitch />
        </div>
      </div>
    </motion.footer>
  );
};

type SocialLinkProps = {
  href: string;
  icon: React.ElementType;
};

const SocialLink = ({ href, icon: Icon }: SocialLinkProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
  >
    <Icon className="h-5 w-5" />
  </motion.a>
);

export default Footer;
