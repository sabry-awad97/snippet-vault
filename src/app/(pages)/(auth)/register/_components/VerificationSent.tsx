import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export const VerificationSent: React.FC = () => (
  <Card className="w-full max-w-md overflow-hidden shadow-lg">
    <CardHeader className="space-y-1 bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
      <CardTitle className="text-center text-3xl font-bold">
        Verification Email Sent
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Please check your email to verify your account.
      </p>
    </CardContent>
  </Card>
);
