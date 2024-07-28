'use client';

import { EnhancedButton } from '@/components/Common/EnhancedButton';
import { motion } from 'framer-motion';
import { Code, Lock, Share2 } from 'lucide-react';
import FeatureCard from './_components/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <main className="container mx-auto px-4 py-16">
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
            <EnhancedButton
              href="/register"
              variant="primary"
              size="lg"
              showArrow
            >
              Get Started
            </EnhancedButton>
            <EnhancedButton href="/login" variant="secondary" size="lg">
              Login
            </EnhancedButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <FeatureCard
            icon={<Code size={40} />}
            title="Organize Your Code"
            description="Keep your snippets organized with custom collections and tags."
          />
          <FeatureCard
            icon={<Share2 size={40} />}
            title="Easy Sharing"
            description="Share your snippets with teammates or the community with a single click."
          />
          <FeatureCard
            icon={<Lock size={40} />}
            title="Secure Storage"
            description="Your snippets are encrypted and securely stored in the cloud."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
            Ready to streamline your coding workflow?
          </h2>
          <EnhancedButton
            href="/register"
            variant="tertiary"
            size="lg"
            showArrow
          >
            Join Snippet Vault Today
          </EnhancedButton>
        </motion.div>
      </main>
    </div>
  );
}
