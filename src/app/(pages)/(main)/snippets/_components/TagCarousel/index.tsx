import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import useSnippetsWithStore from '@/hooks/useSnippetStore';
import useTags from '@/hooks/useTags';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const TagCarousel = () => {
  const { tags } = useTags();
  const { selectedTags, toggleTagSelection } = useSnippetsWithStore();
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  const handleTagClick = (tag: string) => {
    toggleTagSelection(tag);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="mx-auto w-full max-w-4xl"
    >
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="relative w-full"
      >
        <CarouselContent>
          {[...tags, ...tags].map((tag, index) => (
            <CarouselItem
              key={`${tag}-${index}`}
              className="md:basis-1/4 lg:basis-1/6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1"
              >
                <Button
                  variant={
                    selectedTags.includes(tag.name) ? 'default' : 'outline'
                  }
                  onClick={() => handleTagClick(tag.name)}
                  className={cn(
                    'h-full w-full rounded-full px-3 py-2 text-sm font-medium transition-all duration-300',
                    {
                      'bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:shadow-xl':
                        selectedTags.includes(tag.name) && isDarkMode,
                      'bg-purple-500 text-white shadow-lg hover:bg-purple-600 hover:shadow-xl':
                        selectedTags.includes(tag.name) && !isDarkMode,
                      'bg-gray-800 text-purple-300 hover:bg-gray-700 hover:text-purple-200':
                        !selectedTags.includes(tag.name) && isDarkMode,
                      'bg-white text-purple-600 hover:bg-purple-100':
                        !selectedTags.includes(tag.name) && !isDarkMode,
                    },
                  )}
                >
                  {tag.name}
                </Button>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={cn(
            'absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300',
            isDarkMode
              ? 'bg-purple-800 text-purple-200'
              : 'bg-purple-100 text-purple-600',
          )}
        />
        <CarouselNext
          className={cn(
            'absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 translate-x-1/2 rounded-full transition-all duration-300',
            isDarkMode
              ? 'bg-purple-800 text-purple-200'
              : 'bg-purple-100 text-purple-600',
          )}
        />
      </Carousel>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {selectedTags.map(tag => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleTagClick(tag)}
              className={cn(
                'flex items-center gap-1 rounded-full px-3 py-1 transition-all duration-300',
                isDarkMode
                  ? 'bg-purple-700 text-white hover:bg-purple-600'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200',
              )}
            >
              {tag}
              <X size={14} />
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TagCarousel;
