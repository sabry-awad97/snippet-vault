import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { useCreateTag, useFetchTags } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Hash, Layers, Plus, Sparkles, TagIcon, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TagFormDialog from '../TagFormDialog';

const TagCarousel = () => {
  const { data: tags, isLoading, error } = useFetchTags();
  const createTagMutation = useCreateTag();
  const {
    isTagCreateFormDialogOpen: isTagFormDialogOpen,
    setIsTagCreateFormDialogOpen: setIsTagFormDialogOpen,
  } = useTagsStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  const selectedTags = useMemo(() => {
    const tagsParam = searchParams.get('tags');
    return tagsParam ? tagsParam.split(',') : [];
  }, [searchParams]);

  const handleTagClick = useCallback(
    (tag: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      const currentTags = newSearchParams.get('tags')?.split(',') || [];

      if (currentTags.includes(tag)) {
        const updatedTags = currentTags.filter(t => t !== tag);
        if (updatedTags.length > 0) {
          newSearchParams.set('tags', updatedTags.join(','));
        } else {
          newSearchParams.delete('tags');
        }
      } else {
        newSearchParams.set('tags', [...currentTags, tag].join(','));
      }

      router.push(`?${newSearchParams.toString()}`);
    },
    [searchParams, router],
  );

  const handleAddTag = () => {
    setIsTagFormDialogOpen(true);
  };

  if (isLoading) {
    return <TagCarouselSkeleton />;
  }

  if (tags?.length === 0) {
    return <EmptyTagCarousel onAddTag={handleAddTag} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {tags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full px-12"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {tags?.map((tag, index) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <CarouselItem
                    key={`${tag.name}-${index}`}
                    className="pl-2 md:basis-1/4 lg:basis-1/6"
                  >
                    <motion.div
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setHoveredTag(tag.name)}
                        onHoverEnd={() => setHoveredTag(null)}
                        className="p-1"
                      >
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => handleTagClick(tag.name)}
                          className={cn(
                            'h-full w-full rounded-full px-3 py-2 text-sm font-medium transition-all duration-300',
                            {
                              'dark:bg-purple-600 dark:text-white dark:shadow-lg dark:hover:bg-purple-700 dark:hover:shadow-xl':
                                isSelected,
                              'bg-purple-500 text-white shadow-lg hover:bg-purple-600 hover:shadow-xl':
                                isSelected,
                              'dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700 dark:hover:text-purple-200':
                                !isSelected,
                              'bg-white text-purple-600 hover:bg-purple-100':
                                !isSelected,
                            },
                          )}
                        >
                          <span className="relative z-10">{tag.name}</span>
                          <motion.div
                            className="absolute inset-0 bg-purple-400"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                              scale: hoveredTag === tag.name ? 1 : 0,
                              opacity: hoveredTag === tag.name ? 0.2 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                'absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full',
                'transition-all duration-300',
                'bg-purple-100 text-purple-600',
                'dark:bg-purple-800 dark:text-purple-200',
              )}
            />
            <CarouselNext
              className={cn(
                'absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 translate-x-1/2',
                'rounded-full transition-all duration-300',
                'bg-purple-100 text-purple-600',
                'dark:bg-purple-800 dark:text-purple-200',
              )}
            />
          </Carousel>

          <TagFormDialog
            isOpen={isTagFormDialogOpen}
            onClose={() => {
              setIsTagFormDialogOpen(false);
            }}
            onSubmit={async (tag: Tag) => {
              await createTagMutation.mutateAsync(tag);
              handleTagClick(tag.name);
            }}
            isDarkMode={theme === 'dark'}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute -right-[15%] bottom-0 -translate-x-1/2"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={handleAddTag}
              className={cn(
                'h-12 w-12 rounded-full transition-all duration-300',
                'bg-purple-100 text-purple-700 hover:bg-purple-200',
                'dark:bg-purple-700 dark:text-purple-100 dark:hover:bg-purple-600',
              )}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
        </Popover>
      </motion.div>
    </div>
  );
};

export default TagCarousel;

const TagCarouselSkeleton = () => {
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full px-12"
      >
        {[...Array(1)].map((_, index) => (
          <CarouselItem key={index} className="pl-2 md:basis-1/4 lg:basis-1/6">
            <div className="p-1">
              <div className="h-10 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </>
  );
};

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
