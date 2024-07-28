import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';

export const SocialLogin = () => (
  <div className="mt-6">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          Or continue with
        </span>
      </div>
    </div>
    <div className="mt-6 flex space-x-2">
      <Button variant="outline" className="w-full">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          {/* Google SVG path */}
        </svg>
        Google
      </Button>
      <Button variant="outline" className="w-full">
        <FaGithub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  </div>
);
