'use client';

import EnhancedLink from '@/components/Common/EnhancedLink';
import { motion } from 'framer-motion';

const CallToActionSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8, duration: 0.8 }}
    className="mt-20 text-center"
  >
    <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
      Ready to streamline your coding workflow?
    </h2>
    <EnhancedLink href="/register" variant="tertiary" size="lg" showArrow>
      Join Snippet Vault Today
    </EnhancedLink>
  </motion.div>
);

export default CallToActionSection;
