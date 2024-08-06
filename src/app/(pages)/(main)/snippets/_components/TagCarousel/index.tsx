import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

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
import TagFormDialog from '../TagFormDialog';

const TagCarousel = () => {
  const { data: tags = [], isLoading, error } = useFetchTags();
  const createTagMutation = useCreateTag();
  const { isTagFormDialogOpen, setIsTagFormDialogOpen } = useTagsStore();
  const { theme } = useCurrentTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

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

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-4"
      >
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full px-12"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {isLoading ? (
              <TagCarouselSkeleton />
            ) : (
              tags.map((tag, index) => {
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
              })
            )}
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
      {[...Array(6)].map((_, index) => (
        <CarouselItem key={index} className="pl-2 md:basis-1/4 lg:basis-1/6">
          <div className="p-1">
            <div className="h-10 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </CarouselItem>
      ))}
    </>
  );
};
