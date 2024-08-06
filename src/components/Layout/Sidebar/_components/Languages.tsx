import { Tooltip } from '@/components/Common/Tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLanguageStore from '@/hooks/useLanguageStore';
import { useSnippetsQuery } from '@/hooks/useSnippets';
import { cn } from '@/lib/utils';
import { titleCase } from '@/lib/utils/stringUtils';
import { humanReadableTimestamp } from '@blaze/human-readable-timestamp';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineScale,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#0ea5e9',
  '#06b6d4',
  '#14b8a6',
  '#10b981',
  '#84cc16',
];

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

const SidebarLanguages: React.FC = () => {
  const { data: snippets = [] } = useSnippetsQuery();
  const { languageIcons } = useLanguageStore();
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'count' | 'name' | 'recent'>('count');
  const [showPercentage, setShowPercentage] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
  const controls = useAnimation();

  const filteredSnippets = useMemo(() => {
    const now = new Date();
    return snippets.filter(snippet => {
      if (timeFilter === 'all') return true;
      const snippetDate = new Date(snippet.createdAt);
      const diffTime = Math.abs(now.getTime() - snippetDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return timeFilter === 'month' ? diffDays <= 30 : diffDays <= 7;
    });
  }, [snippets, timeFilter]);

  const snippetLanguages = useMemo(() => {
    const languageCounts = filteredSnippets.reduce(
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
        lastUsed: new Date(
          Math.max(
            ...filteredSnippets
              .filter(s => s.language === language)
              .map(s => new Date(s.createdAt).getTime()),
          ),
        ),
      }))
      .sort((a, b) => {
        if (sortBy === 'count') return b.count - a.count;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      });

    return languages;
  }, [filteredSnippets, languageIcons, sortBy]);

  const maxCount = Math.max(...snippetLanguages.map(lang => lang.count));
  const totalCount = snippetLanguages.reduce(
    (sum, lang) => sum + lang.count,
    0,
  );

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls, sortBy, showPercentage, viewMode, timeFilter]);

  const chartData = snippetLanguages.map(lang => ({
    name: lang.name,
    value: lang.count,
  }));

  return (
    <motion.div
      className="mt-8 text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="font-semibold text-slate-400">Languages</div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <Tabs
              value={viewMode}
              onValueChange={value => setViewMode(value as 'list' | 'chart')}
            >
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select
              value={timeFilter}
              onValueChange={v => setTimeFilter(v as 'all' | 'month' | 'week')}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Time filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {viewMode === 'list' ? (
            <div className="flex items-center space-x-2">
              <Tooltip content="Toggle percentage display">
                <motion.button
                  onClick={() => setShowPercentage(!showPercentage)}
                  className={cn(
                    'rounded-full p-2',
                    showPercentage
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
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
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
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
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiOutlineSparkles size={20} />
                </motion.button>
              </Tooltip>
              <Tooltip content="Sort by most recent">
                <motion.button
                  onClick={() => setSortBy('recent')}
                  className={cn(
                    'rounded-full p-2',
                    sortBy === 'recent'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiOutlineClock size={20} />
                </motion.button>
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
      {viewMode === 'list' ? (
        <ScrollArea className="h-[10rem]">
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
      ) : (
        <div className="h-[10rem]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded bg-white p-2 shadow">
                        <p className="font-semibold">{titleCase(data.name)}</p>
                        <p>Count: {data.value}</p>
                        <p>
                          Percentage:{' '}
                          {((data.value / totalCount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

interface LanguageItemProps {
  icon?: IconType;
  name: string;
  count: number;
  lastUsed: Date;
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
  lastUsed,
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
          'relative flex w-full cursor-pointer select-none flex-col rounded-lg p-2',
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
        <div className="z-10 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
            )}
            <span className="font-medium">{titleCase(name)}</span>
          </div>
          <motion.div
            className="flex items-center gap-2"
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
        </div>
        <div className="z-10 flex items-center justify-start text-xs opacity-80">
          <Tooltip
            side="right"
            content={`Last used: ${lastUsed.toLocaleDateString()}`}
          >
            <span className="flex items-center">
              <HiOutlineClock className="mr-1" />
              {humanReadableTimestamp(lastUsed)}
            </span>
          </Tooltip>
        </div>
      </motion.div>
    </motion.li>
  );
};

export default SidebarLanguages;
