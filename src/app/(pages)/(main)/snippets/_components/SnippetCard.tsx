import { Tooltip } from '@/components/Common/Tooltip';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Snippet } from '@/lib/schemas/snippet';
import { AnimatePresence, motion } from 'framer-motion';
import { Code, Copy, Edit, Moon, Star, Sun, Tag, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vs,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SnippetCardProps {
  snippet: Snippet;
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onFavorite: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onDelete,
  onCopy,
  onEdit,
  onFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFavorite, setIsFavorite] = useState(snippet.isFavorite || false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite();
  };

  const cardClasses = `flex h-[400px] flex-col overflow-hidden border-${
    isDarkMode ? 'purple-700' : 'purple-200'
  } ${
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  } shadow-lg transition-all duration-300 hover:shadow-xl`;

  const headerClasses = `${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} p-4`;

  const titleClasses = `flex items-center text-lg font-semibold ${
    isDarkMode ? 'text-purple-300' : 'text-purple-800'
  }`;

  const contentClasses = `flex-grow overflow-hidden p-4 ${
    isDarkMode ? 'text-gray-300' : 'text-gray-800'
  }`;

  const footerClasses = `flex justify-end space-x-2 ${
    isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
  } p-4`;

  const buttonClasses = `border-${isDarkMode ? 'purple-600' : 'purple-300'} ${
    isDarkMode ? 'text-purple-300' : 'text-purple-700'
  } hover:bg-${isDarkMode ? 'purple-800' : 'purple-100'} hover:text-${
    isDarkMode ? 'purple-200' : 'purple-800'
  } focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cardClasses}>
        <CardHeader className={headerClasses}>
          <CardTitle className={titleClasses}>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Code
                className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
              />
            </motion.div>
            {snippet.title}
          </CardTitle>
        </CardHeader>
        <CardContent className={contentClasses}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-grow overflow-y-auto rounded-md"
          >
            <SyntaxHighlighter
              language={snippet.language}
              style={isDarkMode ? vscDarkPlus : vs}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                height: '100%',
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex flex-wrap items-center"
          >
            <span
              className={`mr-4 flex items-center text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}
            >
              <Tag className="mr-1 h-4 w-4" />
              {snippet.language}
            </span>
            <span
              className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}
            >
              Created: {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          </motion.div>
          <AnimatePresence>
            {snippet.tags && snippet.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.6 }}
                className="mt-2 flex flex-wrap"
              >
                {snippet.tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`mr-2 mt-2 rounded-full ${
                      isDarkMode
                        ? 'bg-purple-800 text-purple-200'
                        : 'bg-purple-100 text-purple-800'
                    } px-2 py-1 text-xs font-medium`}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className={footerClasses}>
          <Tooltip content="Toggle Dark Mode">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className={buttonClasses}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.div>
            </Button>
          </Tooltip>
          <Tooltip content={isFavorite ? 'Unfavorite' : 'Favorite'}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              className={buttonClasses}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Star
                  className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                />
              </motion.div>
            </Button>
          </Tooltip>
          <Tooltip content="Copy">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className={buttonClasses}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Copy className="h-4 w-4" />
              </motion.div>
            </Button>
          </Tooltip>
          <Tooltip content="Edit">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className={buttonClasses}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Edit className="h-4 w-4" />
              </motion.div>
            </Button>
          </Tooltip>
          <Tooltip content="Delete">
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className={`bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                isDarkMode ? 'hover:bg-red-700' : ''
              }`}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Trash2 className="h-4 w-4" />
              </motion.div>
            </Button>
          </Tooltip>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SnippetCard;
