'use client';

import EnhancedLink from '@/components/Common/EnhancedLink';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <h1 className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
      Snippet Vault
    </h1>
    <p className="mb-8 text-xl text-gray-700 dark:text-gray-300 md:text-2xl">
      Organize, share, and collaborate on your code snippets with ease.
    </p>
    <div className="flex justify-center space-x-4">
      <EnhancedLink href="/register" variant="primary" size="lg" showArrow>
        Get Started
      </EnhancedLink>
      <EnhancedLink href="/login" variant="secondary" size="lg">
        Login
      </EnhancedLink>
    </div>
  </motion.div>
);

export default HeroSection;
