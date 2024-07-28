'use client';

import EnhancedLink from '@/components/Common/EnhancedLink';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const CallToActionSection = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mt-20 text-center"
    >
      <h2 className="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-200">
        {user
          ? 'Ready to enhance your coding workflow?'
          : 'Ready to streamline your coding workflow?'}
      </h2>
      {user ? (
        <EnhancedLink href="/snippets" variant="tertiary" size="lg" showArrow>
          Go to Your Snippets
        </EnhancedLink>
      ) : (
        <EnhancedLink href="/register" variant="tertiary" size="lg" showArrow>
          Join Snippet Vault Today
        </EnhancedLink>
      )}
    </motion.div>
  );
};

export default CallToActionSection;
