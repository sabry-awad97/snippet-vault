import { Tooltip } from '@/components/Common/Tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import useLanguageStore from '@/hooks/useLanguageStore';
import { useSnippetsQuery } from '@/hooks/useSnippets';
import { cn } from '@/lib/utils';
import { titleCase } from '@/lib/utils/stringUtils';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import {
  HiOutlineChartBar,
  HiOutlineScale,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { IconType } from 'react-icons/lib';

const navItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const hoverAnimation = {
  whileHover: { scale: 1.03, transition: { type: 'spring', stiffness: 400 } },
  whileTap: { scale: 0.97, transition: { type: 'spring', stiffness: 400 } },
};

const Languages: React.FC = () => {
  const { data: snippets = [] } = useSnippetsQuery();
  const { languageIcons } = useLanguageStore();
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'count' | 'name'>('count');
  const [showPercentage, setShowPercentage] = useState(true);
  const controls = useAnimation();

  const snippetLanguages = useMemo(() => {
    const languageCounts = snippets.reduce(
      (counts, snippet) => {
        const language = snippet.language;
        counts[language] = (counts[language] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );

    const languages = Object.entries(languageCounts)
      .map(([language, count]) => ({
        icon: languageIcons[language],
        name: language,
        count,
      }))
      .sort((a, b) =>
        sortBy === 'count' ? b.count - a.count : a.name.localeCompare(b.name),
      );

    return languages;
  }, [snippets, languageIcons, sortBy]);

  const maxCount = Math.max(...snippetLanguages.map(lang => lang.count));
  const totalCount = snippetLanguages.reduce(
    (sum, lang) => sum + lang.count,
    0,
  );

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls, sortBy, showPercentage]);

  return (
    <motion.div
      className="mt-14 text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-400">Languages</h2>
        <div className="flex items-center space-x-2">
          <Tooltip content="Toggle percentage display">
            <motion.button
              onClick={() => setShowPercentage(!showPercentage)}
              className={cn(
                'rounded-full p-2',
                showPercentage
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-600',
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiOutlineScale size={20} />
            </motion.button>
          </Tooltip>
          <Tooltip content="Sort by count">
            <motion.button
              onClick={() => setSortBy('count')}
              className={cn(
                'rounded-full p-2',
                sortBy === 'count'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-600',
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiOutlineChartBar size={20} />
            </motion.button>
          </Tooltip>
          <Tooltip content="Sort alphabetically">
            <motion.button
              onClick={() => setSortBy('name')}
              className={cn(
                'rounded-full p-2',
                sortBy === 'name'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-600',
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiOutlineSparkles size={20} />
            </motion.button>
          </Tooltip>
        </div>
      </div>
      <ScrollArea className="h-[24rem]">
        <AnimatePresence>
          <motion.ul
            className="grid grid-cols-1 gap-3"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {snippetLanguages.map((language, index) => (
              <LanguageItem
                key={language.name}
                {...language}
                index={index}
                maxCount={maxCount}
                totalCount={totalCount}
                isHovered={hoveredLanguage === language.name}
                onHover={() => setHoveredLanguage(language.name)}
                onLeave={() => setHoveredLanguage(null)}
                showPercentage={showPercentage}
              />
            ))}
          </motion.ul>
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
};

interface LanguageItemProps {
  icon?: IconType;
  name: string;
  count: number;
  index: number;
  maxCount: number;
  totalCount: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  showPercentage: boolean;
}

const LanguageItem: React.FC<LanguageItemProps> = ({
  icon: Icon,
  name,
  count,
  index,
  maxCount,
  totalCount,
  isHovered,
  onHover,
  onLeave,
  showPercentage,
}) => {
  const percentage = (count / maxCount) * 100;
  const globalPercentage = (count / totalCount) * 100;

  return (
    <motion.li
      variants={navItemVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg p-4',
          'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 text-white',
          'overflow-hidden transition-all duration-300 ease-in-out',
          isHovered ? 'shadow-lg shadow-purple-500/30' : 'shadow-md',
        )}
        {...hoverAnimation}
      >
        <motion.div
          className="absolute inset-0 bg-white opacity-10"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
        <div className="z-10 flex items-center gap-3">
          {Icon && (
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          )}
          <span className="font-medium">{titleCase(name)}</span>
        </div>
        <motion.div
          className="z-10 flex items-center gap-2"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {showPercentage && (
            <span className="text-xs opacity-80">
              {globalPercentage.toFixed(1)}%
            </span>
          )}
          <span className="inline-flex items-center justify-center rounded-full bg-white/20 px-2 py-1 text-sm font-semibold backdrop-blur-sm">
            {count}
          </span>
        </motion.div>
      </motion.div>
    </motion.li>
  );
};

export default Languages;
