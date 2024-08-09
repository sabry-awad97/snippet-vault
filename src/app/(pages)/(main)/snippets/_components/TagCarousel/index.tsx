import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { useCreateTag, useFetchTags } from '@/hooks/useTags';
import useTagsStore from '@/hooks/useTagsStore';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import TagFormDialog from '../TagFormDialog';
import EmptyTagCarousel from './EmptyTagCarousel';
import TagCarouselSkeleton from './TagCarouselSkeleton';

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

  const tagVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

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
                    className="pl-2 md:basis-1/4 lg:basis-1/5"
                  >
                    <motion.div custom={index} variants={tagVariants}>
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
                            'group relative h-full w-full overflow-hidden rounded-full px-3 py-2 text-sm font-medium transition-all duration-300',
                            {
                              'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl':
                                isSelected,
                              'bg-white text-purple-600 hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700':
                                !isSelected,
                            },
                          )}
                        >
                          <span className="relative z-10">{tag.name}</span>
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 z-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-yellow-300 opacity-75" />
                              <Sparkles className="absolute -bottom-1 -left-1 h-4 w-4 text-yellow-300 opacity-75" />
                            </motion.div>
                          )}
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
        </motion.div>
      )}

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
    </div>
  );
};

export default TagCarousel;
