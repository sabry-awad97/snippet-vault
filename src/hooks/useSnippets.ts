import { Snippet, SnippetState } from '@/lib/schemas/snippet';
import * as snippetsApi from '@/lib/tauri/api/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useSnippetStore from './useSnippetStore';

const useSnippets = () => {
  const queryClient = useQueryClient();

  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: ['snippets'],
    queryFn: async () => {
      const snippets = await snippetsApi.listSnippets({ filter: {} });
      useSnippetStore.setState({ snippets, filteredSnippets: snippets });
      return snippets;
    },
  });

  const createMutation = useMutation({
    mutationKey: ['createSnippet'],
    mutationFn: (newSnippet: Snippet) =>
      snippetsApi.createSnippet({ data: newSnippet }),
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
    mutationFn: async (updatedSnippet: Snippet) =>
      snippetsApi.updateSnippet({
        id: updatedSnippet.id,
        data: updatedSnippet,
      }),
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
    mutationFn: async (id: string) => snippetsApi.deleteSnippet({ id }),
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

  const updateSnippetStateMutation = useMutation({
    mutationKey: ['updateSnippetState'],
    mutationFn: async (params: {
      id: string;
      data: Partial<Omit<SnippetState, 'id'>>;
    }) => snippetsApi.updateSnippetState(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to update snippet state.',
      });
      console.error('Update Snippet State Error:', error);
    },
  });

  return {
    snippets,
    createSnippet: createMutation.mutateAsync,
    updateSnippet: updateMutation.mutateAsync,
    deleteSnippet: deleteMutation.mutateAsync,
    updateSnippetState: updateSnippetStateMutation.mutateAsync,
  };
};

export default useSnippets;
