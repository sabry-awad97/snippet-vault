import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';
import { FiPlus } from 'react-icons/fi';

interface NewTagFormProps {
  newTagName: string;
  onNewTagNameChange: (value: string) => void;
  onCreateTag: () => void;
  isDarkMode: boolean;
}

const NewTagForm: React.FC<NewTagFormProps> = ({
  newTagName,
  onNewTagNameChange,
  onCreateTag,
  isDarkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <Label
        htmlFor="newTagName"
        className={cn(
          'mb-2 block font-semibold',
          isDarkMode ? 'text-purple-300' : 'text-purple-700',
        )}
      >
        New Tag
      </Label>
      <div className="flex space-x-2">
        <Input
          id="newTagName"
          value={newTagName}
          onChange={e => onNewTagNameChange(e.target.value)}
          className={cn(
            'flex-grow rounded-md border-2 px-4 py-2 transition-all duration-200',
            isDarkMode
              ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
              : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
            'focus:outline-none focus:ring-2',
          )}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onCreateTag}
            className={cn(
              'rounded-md px-4 py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
              isDarkMode
                ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
            )}
          >
            <FiPlus className="mr-2 h-4 w-4" /> Add
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NewTagForm;
