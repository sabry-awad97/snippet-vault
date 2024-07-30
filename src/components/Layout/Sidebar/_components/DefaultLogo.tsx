import { SparklesText } from '@/components/ui/sparkles-text';
import { motion } from 'framer-motion';
import { Braces } from 'lucide-react';

const DefaultLogo = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="flex items-center gap-2"
  >
    <div className="rounded-md bg-purple-600 p-2">
      <Braces className="size-5 sm:text-white" />
    </div>

    <SparklesText className="text-lg font-semibold" text="Snippet Vault" />
  </motion.div>
);

export default DefaultLogo;
