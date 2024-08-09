import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Hash, Layers, Plus, Sparkles, TagIcon, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EmptyTagCarouselProps {
  onAddTag: () => void;
  isDarkMode: boolean;
}

const EmptyTagCarousel: React.FC<EmptyTagCarouselProps> = ({
  onAddTag,
  isDarkMode,
}) => {
  const [currentBenefit, setCurrentBenefit] = useState(0);

  const colorScheme = isDarkMode
    ? {
        bg: 'from-gray-900 via-purple-900 to-indigo-900',
        border: 'border-purple-700',
        text: 'text-white',
        subtext: 'text-purple-200',
        button: 'bg-purple-600 hover:bg-purple-500',
        icon: 'text-purple-400',
      }
    : {
        bg: 'from-white via-purple-50 to-indigo-100',
        border: 'border-purple-200',
        text: 'text-gray-800',
        subtext: 'text-purple-700',
        button: 'bg-purple-500 hover:bg-purple-600',
        icon: 'text-purple-500',
      };

  const benefits = [
    { icon: Hash, text: 'Organize snippets effortlessly' },
    { icon: Zap, text: 'Boost your productivity' },
    { icon: Layers, text: 'Create a structured knowledge base' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBenefit(prev => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [setCurrentBenefit, benefits.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
      className={cn(
        'relative mx-auto w-full overflow-hidden rounded-2xl border-2 border-dashed p-12',
        colorScheme.border,
        'bg-gradient-to-br',
        colorScheme.bg,
      )}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? '#9333ea' : '#a855f7'} 10%, transparent 10%)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative mb-8"
        >
          <TagIcon className={cn('h-32 w-32', colorScheme.icon)} />
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 0 0px ${isDarkMode ? 'rgba(167, 139, 250, 0.3)' : 'rgba(167, 139, 250, 0.1)'}`,
                `0 0 0 20px ${isDarkMode ? 'rgba(167, 139, 250, 0)' : 'rgba(167, 139, 250, 0)'}`,
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn('mb-4 text-4xl font-bold', colorScheme.text)}
        >
          Unleash Your Tag Potential
        </motion.h3>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn('mb-8 h-16')}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBenefit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-2"
            >
              {React.createElement(benefits[currentBenefit].icon, {
                className: cn('h-8 w-8', colorScheme.icon),
              })}
              <p className={cn('text-xl', colorScheme.subtext)}>
                {benefits[currentBenefit].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onAddTag}
            className={cn(
              'group relative overflow-hidden px-8 py-3 text-lg font-semibold text-white transition-all duration-300',
              colorScheme.button,
            )}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Your First Tag</span>
            </span>
            <motion.div
              className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ rotate: 360, scale: 1.5 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{
                background: `radial-gradient(circle, ${
                  isDarkMode
                    ? 'rgba(168, 85, 247, 0.4)'
                    : 'rgba(192, 132, 252, 0.4)'
                } 0%, transparent 70%)`,
              }}
            />
          </Button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <Sparkles
        className={cn('absolute right-8 top-8 h-10 w-10', colorScheme.icon)}
      />
      <Sparkles
        className={cn('absolute bottom-8 left-8 h-10 w-10', colorScheme.icon)}
      />
    </motion.div>
  );
};

export default EmptyTagCarousel;
