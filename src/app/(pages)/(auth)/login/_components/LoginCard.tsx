import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { SocialLogin } from './SocialLogin';

export const LoginCard = () => (
  <Card className="overflow-hidden shadow-lg">
    <div className="flex flex-col md:flex-row">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white md:w-1/3">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-purple-100">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <div className="mt-6">
          <p className="text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-white hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <CardContent className="p-6 md:w-2/3">
        <LoginForm />
        <SocialLogin />
      </CardContent>
    </div>
  </Card>
);
