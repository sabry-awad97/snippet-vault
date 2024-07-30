import { SnippetContext } from '@/contexts/SnippetContext';
import { useContext } from 'react';

const useSnippetsContext = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippetsContext must be used within a SnippetProvider');
  }
  return context;
};

export default useSnippetsContext;
