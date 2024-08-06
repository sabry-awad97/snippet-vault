import { Card } from '@/components/ui/card';
import useLanguageStore from '@/hooks/useLanguageStore';
import { Snippet } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import SnippetCardContent from './SnippetCardContent';
import SnippetCardFooter from './SnippetCardFooter';
import SnippetCardHeader from './SnippetCardHeader';

interface SnippetCardProps {
  snippet: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  const [isHovered, setIsHovered] = useState(false);

  const languages = useLanguageStore(state => state.languages);

  const codeLanguage = useMemo(() => {
    return languages.find(language => language.name === snippet.language);
  }, [languages, snippet.language]);

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
            'border-purple-700 bg-gray-800': snippet.state?.isDark,
            'border-purple-200 bg-white': !snippet.state?.isDark,
          },
        )}
      >
        <SnippetCardHeader snippet={snippet} isHovered={isHovered} />
        <SnippetCardContent snippet={snippet} />
        <SnippetCardFooter
          snippet={snippet}
          languageIcon={codeLanguage?.icon}
        />
      </Card>
    </motion.div>
  );
};

export default SnippetCard;
