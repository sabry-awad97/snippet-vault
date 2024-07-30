import notes from '@/initialData/notes';
import { Snippet, snippetSchema } from '@/lib/schemas/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const useSnippets = () => {
  const queryClient = useQueryClient();
  const [initialSnippets, setInitialSnippets] = useState(
    snippetSchema.array().parse(notes),
  );

  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: ['snippets'],
    queryFn: () => initialSnippets,
  });

  const createMutation = useMutation({
    mutationKey: ['createSnippet'],
    mutationFn: async (newSnippet: Snippet) => {
      setInitialSnippets([...initialSnippets, newSnippet]);
      return newSnippet;
    },
    onSuccess: () => {
      toast.success('Snippet Created', {
        description: 'Your snippet has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to create snippet.',
      });
      console.error('Create Snippet Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateSnippet'],
    mutationFn: async (updatedSnippet: Snippet) => {
      const index = initialSnippets.findIndex(s => s.id === updatedSnippet.id);
      if (index !== -1) {
        setInitialSnippets([
          ...initialSnippets.slice(0, index),
          updatedSnippet,
          ...initialSnippets.slice(index + 1),
        ]);
      }
      return updatedSnippet;
    },
    onSuccess: () => {
      toast.success('Snippet Updated', {
        description: 'Your snippet has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to update snippet.',
      });
      console.error('Update Snippet Error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteSnippet'],
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        setInitialSnippets([
          ...initialSnippets.slice(0, index),
          ...initialSnippets.slice(index + 1),
        ]);
      }

      return id;
    },
    onSuccess: () => {
      toast.success('Snippet Deleted', {
        description: 'Your snippet has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to delete snippet.',
      });
      console.error('Delete Snippet Error:', error);
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationKey: ['toggleFavorite'],
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        setInitialSnippets([
          ...initialSnippets.slice(0, index),
          {
            ...initialSnippets[index],
            state: {
              ...initialSnippets[index].state,
              isFavorite: !initialSnippets[index].state.isFavorite,
            },
          },
          ...initialSnippets.slice(index + 1),
        ]);
      }
      return id;
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to toggle favorite.',
      });
      console.error('Toggle Favorite Error:', error);
    },
  });

  const toggleDarkModeMutation = useMutation({
    mutationKey: ['toggleDarkMode'],
    mutationFn: async (id: string) => {
      const index = initialSnippets.findIndex(s => s.id === id);
      if (index !== -1) {
        setInitialSnippets([
          ...initialSnippets.slice(0, index),
          {
            ...initialSnippets[index],
            state: {
              ...initialSnippets[index].state,
              isDark: !initialSnippets[index].state.isDark,
            },
          },
          ...initialSnippets.slice(index + 1),
        ]);
      }
      return id;
    },
  });

  return {
    snippets,
    createSnippet: createMutation.mutateAsync,
    updateSnippet: updateMutation.mutateAsync,
    deleteSnippet: deleteMutation.mutateAsync,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    toggleDarkMode: toggleDarkModeMutation.mutateAsync,
  };
};

export default useSnippets;
