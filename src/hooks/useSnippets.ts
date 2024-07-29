import { SnippetContext } from '@/contexts/SnippetContext';
import { useContext } from 'react';

const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
};

export default useSnippets;
