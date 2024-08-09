import { Tooltip } from '@/components/Common/Tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { useDeleteTag, useFetchTags, useUpdateTag } from '@/hooks/useTags';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { closestCorners } from '@dnd-kit/core';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Grid,
  List,
  Moon,
  Shuffle,
  Sparkles,
  Star,
  Sun,
  Tag as TagIcon,
  Trash2,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import TagUpdateFormDialog from '../TagFormDialog';
import TagListSkeleton from './TagListSkeleton';

interface TagsState {
  favoriteTagIds: string[];
  tagSize: number;
  tagView: 'list' | 'grid';
  highlightedTag: string | null;
  isTagEditFormDialogOpen: boolean;
  editingTag: Tag | null;
  toggleFavorite: (tagId: string) => void;
  setTagSize: (size: number) => void;
  setTagView: (view: 'list' | 'grid') => void;
  setHighlightedTag: (tagId: string | null) => void;
  setIsTagEditFormDialogOpen: (isOpen: boolean) => void;
  setEditingTag: (tag: Tag | null) => void;
}

const useTagsStore = create<TagsState>()(
  persist(
    set => ({
      favoriteTagIds: [],
      tagSize: 100,
      tagView: 'list',
      highlightedTag: null,
      isTagEditFormDialogOpen: false,
      editingTag: null,
      toggleFavorite: tagId =>
        set(state => {
          const newFavorites = new Set(state.favoriteTagIds);
          if (newFavorites.has(tagId)) {
            newFavorites.delete(tagId);
          } else {
            newFavorites.add(tagId);
          }
          return { favoriteTagIds: Array.from(newFavorites) };
        }),
      setTagSize: size => set({ tagSize: size }),
      setTagView: view => set({ tagView: view }),
      setHighlightedTag: tagId => set({ highlightedTag: tagId }),
      setIsTagEditFormDialogOpen: isOpen =>
        set({ isTagEditFormDialogOpen: isOpen }),
      setEditingTag: tag => set({ editingTag: tag }),
    }),
    {
      name: 'tags-storage',
      getStorage: () => localStorage,
    },
  ),
);

interface ExistingTagsListProps {
  searchTerm: string;
  sortBy: 'name' | 'color' | 'recent';
}

const CosmicBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const drawStar = (star: { x: number; y: number; radius: number }) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
        if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;

        drawStar(star);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const ExistingTagsList: React.FC<ExistingTagsListProps> = ({
  searchTerm,
  sortBy,
}) => {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const { theme, setTheme } = useCurrentTheme();
  const { data: existingTags = [], isLoading, error } = useFetchTags();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();
  const {
    favoriteTagIds,
    tagSize,
    tagView,
    highlightedTag,
    isTagEditFormDialogOpen,
    editingTag,
    toggleFavorite,
    setTagSize,
    setTagView,
    setHighlightedTag,
    setIsTagEditFormDialogOpen,
    setEditingTag,
  } = useTagsStore();

  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const filtered = existingTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedTags = filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'color') return (a.color || '').localeCompare(b.color || '');
    if (sortBy === 'recent')
      return b.createdAt.getTime() - a.createdAt.getTime();
    return 0;
  });

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTagMutation.mutateAsync(tagId);
      toast.success('Tag Deleted', {
        description: 'Your cosmic tag has been successfully deleted.',
        icon: <TagIcon className="h-5 w-5 text-red-500" />,
      });
    } catch (error) {
      console.error('Delete Tag Error:', error);
      toast.error('Error', {
        description: 'Failed to delete the cosmic tag.',
      });
    }
  };

  const handleMove = (event: { activeIndex: number; overIndex: number }) => {
    const { activeIndex, overIndex } = event;
    if (activeIndex !== overIndex) {
      const newTags = [...sortedTags];
      const [removed] = newTags.splice(activeIndex, 1);
      newTags.splice(overIndex, 0, removed);

      newTags.forEach((tag, index) => {
        const element = document.getElementById(`tag-${tag.id}`);
        if (element) {
          element.style.transition = 'transform 0.3s ease-out';
          element.style.transform = `translateY(${
            (index - activeIndex) * (tagSize + 8)
          }px)`;
          setTimeout(() => {
            element.style.transition = '';
            element.style.transform = '';
          }, 300);
        }
      });
    }
  };

  const handleValueChange = (newTags: Tag[]) => {
    console.log('New tags:', newTags);
  };

  const tagItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: '0 0 20px rgba(147, 51, 234, 0.7)' },
  };

  const TagItem: React.FC<{ tag: Tag }> = ({ tag }) => (
    <SortableItem key={tag.id} value={tag.id}>
      <motion.div
        layout
        variants={tagItemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        style={{
          height: tagView === 'list' ? `${tagSize}px` : 'auto',
          background: `linear-gradient(135deg, ${tag.color}33, ${tag.color}22)`,
        }}
        className={cn(
          'group relative mb-2 overflow-hidden rounded-lg border p-3 backdrop-blur-sm transition-all duration-300',
          isDarkMode ? 'border-purple-700' : 'border-purple-300',
          tagView === 'list'
            ? 'flex items-center justify-between'
            : 'flex flex-col items-center space-y-2',
          isDarkMode ? 'text-purple-200' : 'text-purple-900',
          expandedTag === tag.id ? 'z-10 scale-105' : '',
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-900 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />

        <div
          className={cn(
            'flex items-center space-x-3',
            tagView === 'grid' ? 'flex-col space-x-0 space-y-2' : '',
          )}
        >
          <SortableDragHandle className="z-10">
            <motion.div
              className="cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <DotsHorizontalIcon className="h-5 w-5" />
            </motion.div>
          </SortableDragHandle>
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
            style={{ backgroundColor: tag.color }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xl">⚽</span>
          </motion.div>
          <span
            className={cn(
              'font-medium',
              tagView === 'grid' ? 'text-center' : '',
            )}
          >
            {tag.name}
          </span>
        </div>

        <div className={cn('flex space-x-2', tagView === 'grid' ? 'mt-2' : '')}>
          <TagActionButton
            icon={Star}
            onClick={() => toggleFavorite(tag.id)}
            isActive={favoriteTagIds.includes(tag.id)}
            activeColor="bg-yellow-500"
            tooltip={
              favoriteTagIds.includes(tag.id)
                ? 'Remove from Favorites'
                : 'Add to Favorites'
            }
          />
          <TagActionButton
            icon={Edit2}
            onClick={() => {
              setEditingTag(tag);
              setIsTagEditFormDialogOpen(true);
            }}
            tooltip="Edit Tag"
          />
          <TagActionButton
            icon={Trash2}
            onClick={() => handleDeleteTag(tag.id)}
            tooltip="Delete Tag"
            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
          />
          <TagActionButton
            icon={expandedTag === tag.id ? ChevronUp : ChevronDown}
            onClick={() =>
              setExpandedTag(expandedTag === tag.id ? null : tag.id)
            }
            tooltip={expandedTag === tag.id ? 'Collapse' : 'Expand'}
          />
        </div>

        <AnimatePresence>
          {highlightedTag === tag.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -right-2 -top-2"
            >
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {expandedTag === tag.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 w-full"
            >
              <p className="text-sm">
                Created: {tag.createdAt.toLocaleDateString()}
              </p>
              <p className="text-sm">Color: {tag.color}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </SortableItem>
  );

  const TagActionButton: React.FC<{
    icon: React.ElementType;
    onClick: () => void;
    isActive?: boolean;
    activeColor?: string;
    tooltip: string;
    className?: string;
  }> = ({ icon: Icon, onClick, isActive, activeColor, tooltip, className }) => (
    <Tooltip content={tooltip}>
      <Button
        onClick={onClick}
        size="sm"
        variant="ghost"
        className={cn(
          'z-10 transition-all duration-200 hover:scale-110',
          isActive
            ? activeColor
            : 'hover:bg-purple-200 dark:hover:bg-purple-800',
          className,
        )}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </Tooltip>
  );

  return (
    <CosmicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="container mx-auto space-y-6 p-6"
      >
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              'text-3xl font-bold',
              isDarkMode ? 'text-purple-200' : 'text-purple-900',
            )}
          >
            Cosmic Tag Realm
          </h3>
          <div className="flex items-center space-x-4">
            <TagActionButton
              icon={tagView === 'list' ? Grid : List}
              onClick={() => setTagView(tagView === 'list' ? 'grid' : 'list')}
              tooltip={`Switch to ${tagView === 'list' ? 'Grid' : 'List'} View`}
            />
            <Slider
              value={[tagSize]}
              onValueChange={([value]) => setTagSize(value)}
              max={150}
              min={50}
              step={10}
              className="w-32"
            />
            <TagActionButton
              icon={isDarkMode ? Sun : Moon}
              onClick={toggleDarkMode}
              tooltip={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              className={isDarkMode ? 'text-yellow-300' : 'text-purple-900'}
            />
            <TagActionButton
              icon={Shuffle}
              onClick={() => {
                const newTags = [...sortedTags].sort(() => Math.random() - 0.5);
                handleValueChange(newTags);
              }}
              tooltip="Shuffle Tags"
            />
          </div>
        </div>

        <ScrollArea
          className={cn(
            'h-[400px] rounded-lg border',
            isDarkMode
              ? 'border-purple-700 bg-purple-900/30'
              : 'border-purple-300 bg-purple-100/30',
          )}
        >
          <Sortable
            value={sortedTags}
            onMove={handleMove}
            onValueChange={handleValueChange}
            collisionDetection={closestCorners}
          >
            {isLoading ? (
              <TagListSkeleton />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                className={cn(
                  'p-4',
                  tagView === 'grid'
                    ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'
                    : '',
                )}
              >
                {sortedTags.map(tag => (
                  <TagItem key={tag.id} tag={tag} />
                ))}
              </motion.div>
            )}
          </Sortable>
        </ScrollArea>

        <TagUpdateFormDialog
          isOpen={isTagEditFormDialogOpen}
          initialTag={editingTag}
          onClose={() => {
            setEditingTag(null);
            setIsTagEditFormDialogOpen(false);
          }}
          onSubmit={async value => {
            try {
              await updateTagMutation.mutateAsync(value);
              setEditingTag(null);
              toast.success('Tag Updated', {
                description: 'Your cosmic tag has been successfully updated.',
                icon: <Zap className="h-5 w-5 text-purple-500" />,
              });
            } catch (error) {
              console.error('Update Tag Error:', error);
              toast.error('Error', {
                description: 'Failed to update the cosmic tag.',
              });
            }
          }}
          isDarkMode={isDarkMode}
        />
      </motion.div>
    </CosmicBackground>
  );
};

export default ExistingTagsList;
