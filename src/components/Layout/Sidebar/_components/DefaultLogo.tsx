import { motion } from 'framer-motion';

const DefaultLogo = () => (
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="text-2xl font-bold text-purple-600 dark:text-purple-400"
  >
    Snippet Vault
  </motion.h2>
);

export default DefaultLogo;
