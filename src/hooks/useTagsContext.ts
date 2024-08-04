import { TagsContext } from '@/contexts/TagsContext';
import { useContext } from 'react';

const useTagsContext = () => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTagsContext must be used within a TagsProvider');
  }
  return context;
};

export default useTagsContext;
