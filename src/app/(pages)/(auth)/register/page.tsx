'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData } from '@/lib/schemas/user';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RegisterForm } from './_components/RegisterForm';
import { VerificationSent } from './_components/VerificationSent';

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const RegisterPage = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);

      // TODO: Send verification email
      setVerificationSent(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {verificationSent ? (
          <VerificationSent />
        ) : (
          <Card className="overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white md:w-1/3">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-3xl font-bold">
                    Create your account
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Enter your details to sign up
                  </CardDescription>
                </CardHeader>
                <div className="mt-6">
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-white hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
              <CardContent className="p-6 md:w-2/3">
                <RegisterForm onSubmit={onSubmit} />
              </CardContent>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
