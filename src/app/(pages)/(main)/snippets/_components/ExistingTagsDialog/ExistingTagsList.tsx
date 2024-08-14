import useCurrentTheme from '@/hooks/useCurrentTheme';
import { useDeleteTag, useFetchTags, useUpdateTag } from '@/hooks/useTags';
import { Tag } from '@/lib/schemas/tag';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import TagUpdateFormDialog from '../TagFormDialog';
import TagActionButton from './TagActionButton';
import TagListSkeleton from './TagListSkeleton';
import { useTagsStore } from './useTagsStore';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { getRandomEmoji } from '@/lib/utils/emojiHelper';
import saveAs from 'file-saver';
import {
  Check,
  Download,
  Edit2,
  Grid,
  List,
  Moon,
  RefreshCw,
  Shuffle,
  Star,
  Sun,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react';

const MotionCard = motion(Card);

interface TagItemProps {
  tag: Tag;
  index: number;
  moveTag: (dragIndex: number, hoverIndex: number) => void;
  tagSize: number;
  isSelected: boolean;
  onSelect: (tagId: string) => void;
  selectionMode: boolean;
}

interface DragItem {
  index: number;
  id: string;
}

const TagItem: React.FC<TagItemProps> = ({
  tag,
  index,
  moveTag,
  tagSize,
  isSelected,
  onSelect,
  selectionMode,
}) => {
  const [currentEmoji, setCurrentEmoji] = useState<string>(getRandomEmoji());
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [particlesVisible, setParticlesVisible] = useState<boolean>(false);
  const { theme } = useCurrentTheme();
  const isDarkMode = theme === 'dark';
  const {
    favoriteTagIds,
    tagView, // 'list' or 'grid'
    toggleFavorite,
    setIsTagEditFormDialogOpen,
    setEditingTag,
  } = useTagsStore();

  const deleteTagMutation = useDeleteTag();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: 'TAG',
    item: { id: tag.id, index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<DragItem, void, {}>({
    accept: 'TAG',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTag(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

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

  const handleDeleteTag = async () => {
    try {
      await deleteTagMutation.mutateAsync(tag.id);
      toast.success('Tag Deleted', {
        description: 'Your cosmic tag has been successfully deleted.',
        icon: <Trash2 className="h-5 w-5 text-red-500" />,
      });
    } catch (error) {
      console.error('Delete Tag Error:', error);
      toast.error('Error', { description: 'Failed to delete the cosmic tag.' });
    }
  };

  const cardVariants = {
    unselected: {
      scale: 1,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
    selected: {
      scale: 1.05,
      boxShadow: `0 10px 20px ${tag.color}66`,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  };

  const emojiVariants = {
    hover: { scale: 1.1, rotate: 360, transition: { duration: 0.5 } },
  };

  const actionButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: `${(Math.random() - 0.5) * 100}%`,
      y: `${(Math.random() - 0.5) * 100}%`,
      transition: { duration: 1, ease: 'easeOut', delay: i * 0.02 },
    }),
  };

  const handleSelect = () => {
    onSelect(tag.id);
    setParticlesVisible(true);
    setTimeout(() => setParticlesVisible(false), 1000);
  };

  return (
    <MotionCard
      ref={ref}
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        background: `linear-gradient(135deg, ${tag.color}22, ${tag.color}11, ${tag.color}05)`,
        borderColor: isSelected ? tag.color : 'transparent',
        cursor: 'default',
      }}
      className={cn(
        'group relative mb-4 overflow-hidden transition-all duration-300',
        'rounded-lg border-2 shadow-lg hover:shadow-xl',
        'flex items-center justify-between p-3',
        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800',
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-5" />

      <div
        className={cn(
          'flex h-full w-full',
          tagView === 'list'
            ? 'flex-row items-center justify-between p-3'
            : 'flex-col items-center justify-center p-4',
        )}
      >
        <div
          className={cn(
            'flex items-center',
            tagView === 'list' ? 'space-x-4' : 'flex-col space-y-3',
          )}
        >
          <div className="relative">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelect}
              className="absolute -left-2 -top-2 z-10"
            />
            <motion.div
              className="relative"
              variants={emojiVariants}
              whileHover="hover"
            >
              <Avatar
                className="relative"
                style={{
                  backgroundColor: tag.color,
                  width: emojiSize.get() * 1.5,
                  height: emojiSize.get() * 1.5,
                }}
              >
                <AvatarFallback style={{ fontSize: fontSize.get() * 1.5 }}>
                  {currentEmoji}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: `0 0 20px ${tag.color}66` }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
            <motion.button
              className="absolute -bottom-1 -right-1 z-10 rounded-full bg-white p-1.5 shadow-md"
              whileHover={{
                scale: 1.2,
                boxShadow: '0 0 15px rgba(147, 51, 234, 0.3)',
              }}
              onClick={e => {
                e.stopPropagation();
                setCurrentEmoji(getRandomEmoji());
              }}
              title="Change emoji"
            >
              <RefreshCw className="h-3 w-3 text-purple-500" />
            </motion.button>
          </div>

          <motion.div
            className={cn(
              'truncate font-semibold',
              tagView === 'grid' ? 'text-center' : '',
            )}
            style={{ fontSize: fontSize.get() * 1.2 }}
          >
            {tag.name}
          </motion.div>
        </div>

        <AnimatePresence>
          <motion.div
            variants={actionButtonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'flex',
              tagView === 'list'
                ? 'space-x-2'
                : 'mt-4 justify-center space-x-4',
            )}
          >
            <TagActionButton
              icon={Star}
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(tag.id);
              }}
              isActive={favoriteTagIds.includes(tag.id)}
              activeColor="bg-yellow-500"
            />
            <TagActionButton
              icon={Edit2}
              onClick={e => {
                e.stopPropagation();
                setEditingTag(tag);
                setIsTagEditFormDialogOpen(true);
              }}
            />
            <TagActionButton
              icon={Trash2}
              onClick={e => {
                e.stopPropagation();
                handleDeleteTag();
              }}
              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute right-2 top-2"
            variants={checkmarkVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: tag.color }}
            >
              <Zap className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {particlesVisible && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{ backgroundColor: tag.color }}
              custom={i}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>
      )}

      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={false}
        animate={{
          boxShadow: isSelected
            ? `0 0 0 2px ${tag.color}, 0 0 20px ${tag.color}66`
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
    </MotionCard>
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectionAnimationComplete, setSelectionAnimationComplete] =
    useState(true);
  const { data: existingTags = [], isLoading, error } = useFetchTags();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();
  const {
    tagSize,
    tagView,
    isTagEditFormDialogOpen,
    editingTag,
    setTagSize,
    setTagView,
    setIsTagEditFormDialogOpen,
    setEditingTag,
    toggleFavorite,
  } = useTagsStore();

  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

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
      reader.onload = async (e: ProgressEvent<FileReader>) => {
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

  const handleBatchDelete = async () => {
    try {
      await Promise.all(
        selectedTags.map(id => deleteTagMutation.mutateAsync(id)),
      );
      toast.success('Tags Deleted', {
        description: `${selectedTags.length} cosmic tags have been successfully deleted.`,
        icon: <Trash2 className="h-5 w-5 text-red-500" />,
      });
      setSelectedTags([]);
    } catch (error) {
      console.error('Batch Delete Error:', error);
      toast.error('Error', {
        description: 'Failed to delete the selected cosmic tags.',
      });
    }
  };

  const handleBatchFavorite = () => {
    selectedTags.forEach(id => toggleFavorite(id));
    toast.success('Tags Updated', {
      description: `${selectedTags.length} cosmic tags have been updated.`,
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    });
    setSelectedTags([]);
  };

  const handleSelectTag = (tagId: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectionAnimationComplete(false);
    }
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTags.length === sortedTags.length) {
      setSelectedTags([]);
      setSelectionMode(false);
    } else {
      setSelectedTags(sortedTags.map(tag => tag.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedTags([]);
    setSelectionMode(false);
  };

  const selectionOverlayVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
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
                  <TagItem
                    key={tag.id}
                    tag={tag}
                    index={index}
                    moveTag={moveTag}
                    tagSize={tagSize}
                    isSelected={selectedTags.includes(tag.id)}
                    onSelect={handleSelectTag}
                    selectionMode={selectionMode}
                  />
                ))}
              </motion.div>
            )}
          </ScrollArea>

          <AnimatePresence>
            {selectionMode && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={selectionOverlayVariants}
                className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform"
                onAnimationComplete={() => setSelectionAnimationComplete(true)}
              >
                <div
                  className={cn(
                    'flex items-center space-x-4 rounded-full px-6 py-3 shadow-lg',
                    isDarkMode
                      ? 'bg-purple-900 text-purple-100'
                      : 'bg-purple-100 text-purple-900',
                  )}
                >
                  <span className="text-sm font-medium">
                    {selectedTags.length} selected
                  </span>
                  <TagActionButton
                    icon={Check}
                    onClick={handleSelectAll}
                    tooltip={
                      selectedTags.length === sortedTags.length
                        ? 'Deselect All'
                        : 'Select All'
                    }
                    className={cn(
                      'transition-colors',
                      selectedTags.length === sortedTags.length
                        ? 'bg-green-500 text-white'
                        : isDarkMode
                          ? 'bg-purple-700 text-purple-100'
                          : 'bg-purple-300 text-purple-900',
                    )}
                  />
                  <TagActionButton
                    icon={Star}
                    onClick={handleBatchFavorite}
                    tooltip="Favorite Selected"
                    className="text-yellow-500"
                  />
                  <TagActionButton
                    icon={Trash2}
                    onClick={handleBatchDelete}
                    tooltip="Delete Selected"
                    className="text-red-500"
                  />
                  <TagActionButton
                    icon={X}
                    onClick={handleClearSelection}
                    tooltip="Clear Selection"
                    className={
                      isDarkMode ? 'text-purple-300' : 'text-purple-700'
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
