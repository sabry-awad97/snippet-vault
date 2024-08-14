import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import useCurrentTheme from '@/hooks/useCurrentTheme';
import { useDeleteTag, useFetchTags, useUpdateTag } from '@/hooks/useTags';
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { getRandomEmoji } from '@/lib/utils/emojiHelper';
import { saveAs } from 'file-saver';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import {
  Download,
  Edit2,
  Grid,
  GripVertical,
  List,
  Moon,
  RefreshCw,
  Shuffle,
  Star,
  Sun,
  TagIcon,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import TagUpdateFormDialog from '../TagFormDialog';
import TagActionButton from './TagActionButton';
import TagListSkeleton from './TagListSkeleton';
import { useTagsStore } from './useTagsStore';

interface DraggableTagItemProps {
  tag: Tag;
  index: number;
  moveTag: (dragIndex: number, hoverIndex: number) => void;
  tagSize: number;
}

const DraggableTagItem: React.FC<DraggableTagItemProps> = ({
  tag,
  index,
  moveTag,
  tagSize,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentEmoji, setCurrentEmoji] = useState(getRandomEmoji());
  const [isHovering, setIsHovering] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'TAG',
    item: { id: tag.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<
    { id: string; index: number },
    void,
    { handlerId: string | symbol | null }
  >({
    accept: 'TAG',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveTag(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const {
    favoriteTagIds,
    tagView,
    highlightedTag,
    toggleFavorite,
    setHighlightedTag,
    setIsTagEditFormDialogOpen,
    setEditingTag,
  } = useTagsStore();

  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (highlightedTag === tag.id) {
      setParticlesVisible(true);
      const timer = setTimeout(() => setParticlesVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTag, tag.id]);

  const tagItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
      transition: { duration: 0.3 },
    },
  };

  const deleteTagMutation = useDeleteTag();

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

  drag(drop(ref));

  const renderParticles = () => {
    return (
      <AnimatePresence>
        {particlesVisible && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-yellow-300"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: Math.random() * 1.5 + 0.5,
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  ease: 'easeOut',
                  delay: Math.random() * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const springConfig = { stiffness: 300, damping: 30 };
  const scale = useSpring(1, springConfig);
  const opacity = useSpring(1, springConfig);
  const fontSize = useSpring(16, springConfig);
  const emojiSize = useSpring(48, springConfig);

  useEffect(() => {
    scale.set(tagSize / 100);
    opacity.set(tagSize / 150);
    fontSize.set(tagSize / 6);
    emojiSize.set(tagSize / 3);
  }, [tagSize, scale, opacity, fontSize, emojiSize]);

  return (
    <motion.div
      ref={ref}
      layout
      variants={tagItemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        opacity: isDragging ? 0.5 : opacity,
        scale,
        height: tagView === 'list' ? `${tagSize}px` : 'auto',
        width: tagView === 'grid' ? `${tagSize * 2}px` : 'auto',
        background: `linear-gradient(135deg, ${tag.color}33, ${tag.color}11)`,
      }}
      className={cn(
        'group relative mb-4 overflow-hidden rounded-xl border backdrop-blur-lg transition-all duration-300',
        isDarkMode ? 'border-purple-700' : 'border-purple-300',
        tagView === 'list'
          ? 'flex items-center justify-between'
          : 'flex flex-col items-center space-y-2',
        isDarkMode ? 'text-purple-200' : 'text-purple-900',
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-900 opacity-0 transition-opacity duration-300 group-hover:opacity-15" />

      {renderParticles()}

      <div
        className={cn(
          'flex w-full items-center',
          tagView === 'grid' ? 'flex-col space-y-2' : 'space-x-4',
        )}
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full shadow-lg"
          style={{
            backgroundColor: tag.color,
            width: emojiSize,
            height: emojiSize,
          }}
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span style={{ fontSize: emojiSize }}>
            {currentEmoji}
          </motion.span>
          <motion.button
            className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md"
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentEmoji(getRandomEmoji())}
            title="Change emoji"
          >
            <RefreshCw className="h-4 w-4 text-purple-500" />
          </motion.button>
        </motion.div>
        <motion.div
          className={cn(
            'truncate font-semibold',
            tagView === 'grid' ? 'w-full text-center' : 'flex-1',
          )}
          style={{ fontSize }}
        >
          {tag.name}
        </motion.div>
      </div>

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              'flex',
              tagView === 'grid' ? 'mt-2 justify-center' : 'space-x-2',
            )}
            style={{ fontSize: fontSize.get() * 0.75 }}
          >
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
              icon={isDarkMode ? Sun : Moon}
              onClick={() => setHighlightedTag(tag.id)}
              tooltip="Highlight Tag"
              className="text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900"
            />
            <motion.div
              className="z-10 flex cursor-move items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <GripVertical className="h-5 w-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {highlightedTag === tag.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="absolute -right-3 -top-3"
          >
            <Zap className="drop-shadow-glow h-12 w-12 text-yellow-300" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ExistingTagsListProps {
  searchTerm: string;
  sortBy: 'name' | 'color' | 'recent';
}

const ExistingTagsList: React.FC<ExistingTagsListProps> = ({
  searchTerm,
  sortBy,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useCurrentTheme();
  const { data: existingTags = [], isLoading, error } = useFetchTags();
  const updateTagMutation = useUpdateTag();
  const {
    tagSize,
    tagView,
    isTagEditFormDialogOpen,
    editingTag,
    setTagSize,
    setTagView,
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

  const moveTag = (dragIndex: number, hoverIndex: number) => {
    const dragTag = sortedTags[dragIndex];
    const newTags = [...sortedTags];
    newTags.splice(dragIndex, 1);
    newTags.splice(hoverIndex, 0, dragTag);
    handleValueChange(newTags);
  };

  const handleValueChange = (newTags: Tag[]) => {
    console.log('New tags:', newTags);
  };

  const backgroundOpacity = useSpring(0.3);
  const borderRadius = useSpring(8);

  useEffect(() => {
    backgroundOpacity.set(tagSize / 300);
    borderRadius.set(tagSize / 10);
  }, [tagSize, backgroundOpacity, borderRadius]);

  const exportTags = () => {
    const tagsJson = JSON.stringify(sortedTags, null, 2);
    const blob = new Blob([tagsJson], { type: 'application/json' });
    saveAs(blob, 'cosmic-tags-export.json');
    toast.success('Tags Exported', {
      description: 'Your cosmic tags have been successfully exported.',
      icon: <Download className="h-5 w-5 text-green-500" />,
    });
  };

  const importTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const importedTags = JSON.parse(e.target?.result as string);
          console.log('Imported tags:', importedTags);
          toast.success('Tags Imported', {
            description: 'Your cosmic tags have been successfully imported.',
            icon: <Upload className="h-5 w-5 text-blue-500" />,
          });
        } catch (error) {
          console.error('Import error:', error);
          toast.error('Import Failed', {
            description: 'Failed to import tags. Please check the file format.',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(128, 0, 128, ${backgroundOpacity}), rgba(75, 0, 130, ${backgroundOpacity}), rgba(0, 0, 0, ${backgroundOpacity}))`,
          borderRadius,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="container mx-auto space-y-6 p-6"
        >
          <div className="flex items-center justify-between">
            <motion.h3
              className={cn(
                'text-3xl font-bold',
                isDarkMode ? 'text-purple-200' : 'text-purple-900',
              )}
            >
              Cosmic Tag Realm
            </motion.h3>
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
                step={1}
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
                  const newTags = [...sortedTags].sort(
                    () => Math.random() - 0.5,
                  );
                  handleValueChange(newTags);
                }}
                tooltip="Shuffle Tags"
              />
              <TagActionButton
                icon={Download}
                onClick={exportTags}
                tooltip="Export Tags"
              />
              <TagActionButton
                icon={Upload}
                onClick={() => fileInputRef.current?.click()}
                tooltip="Import Tags"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={importTags}
              />
            </div>
          </div>

          <ScrollArea
            className={cn(
              'rounded-lg border',
              isDarkMode
                ? 'border-purple-700 bg-purple-900/30'
                : 'border-purple-300 bg-purple-100/30',
            )}
            style={{ height: `${tagSize * 4}px` }}
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
                style={{
                  gridTemplateColumns:
                    tagView === 'grid'
                      ? `repeat(auto-fill, minmax(${tagSize * 2}px, 1fr))`
                      : 'none',
                }}
              >
                {sortedTags.map((tag, index) => (
                  <DraggableTagItem
                    key={tag.id}
                    tag={tag}
                    index={index}
                    moveTag={moveTag}
                    tagSize={tagSize}
                  />
                ))}
              </motion.div>
            )}
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
      </motion.div>
    </DndProvider>
  );
};

export default ExistingTagsList;
