'use client';

import { motion } from 'framer-motion';
import { LoginCard } from './_components/LoginCard';

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <LoginCard />
      </motion.div>
    </div>
  );
};

export default LoginPage;
