import { Card } from '@/components/ui/card';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import SnippetCardContent from './SnippetCardContent';
import SnippetCardFooter from './SnippetCardFooter';
import SnippetCardHeader from './SnippetCardHeader';

interface SnippetCardProps {
  snippet: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-1"
    >
      <Card
        className={cn(
          `flex flex-1 flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl`,
          {
            'border-purple-700 bg-gray-800': isDarkMode,
            'border-purple-200 bg-white': !isDarkMode,
          },
        )}
      >
        <SnippetCardHeader {...{ snippet, isDarkMode, isHovered }} />
        <SnippetCardContent {...{ snippet, isDarkMode }} />
        <SnippetCardFooter
          {...{
            snippet,
            isDarkMode,
            toggleDarkMode,
          }}
        />
      </Card>
    </motion.div>
  );
};

export default SnippetCard;
