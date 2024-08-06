import { Snippet, SnippetState } from '@/lib/schemas/snippet';
import * as snippetsApi from '@/lib/tauri/api/snippet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSnippetsQuery = (filter: snippetsApi.SnippetFilter = {}) => {
  return useQuery<Snippet[]>({
    queryKey: ['snippets', filter],
    queryFn: () => snippetsApi.listSnippets({ filter }),
  });
};

export const useCreateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useDeleteSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useUpdateSnippetState = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};
