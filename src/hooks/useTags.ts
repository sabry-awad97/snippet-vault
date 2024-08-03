import { Tag } from '@/lib/schemas/tag';
import * as tagsApi from '@/lib/tauri/api/tag';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const useTags = () => {
  const queryClient = useQueryClient();

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['Tags'],
    queryFn: () => tagsApi.listTags({ filter: {} }),
  });

  const createMutation = useMutation({
    mutationKey: ['createTag'],
    mutationFn: (newTag: Tag) => tagsApi.createTag({ data: newTag }),
    onSuccess: () => {
      toast.success('Tag Created', {
        description: 'Your Tag has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['Tags'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to create Tag.',
      });
      console.error('Create Tag Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateTag'],
    mutationFn: async (updatedTag: Tag) =>
      tagsApi.updateTag({
        id: updatedTag.id,
        data: updatedTag,
      }),
    onSuccess: () => {
      toast.success('Tag Updated', {
        description: 'Your Tag has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['Tags'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to update Tag.',
      });
      console.error('Update Tag Error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteTag'],
    mutationFn: async (id: string) => tagsApi.deleteTag({ id }),
    onSuccess: () => {
      toast.success('Tag Deleted', {
        description: 'Your Tag has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['Tags'] });
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to delete Tag.',
      });
      console.error('Delete Tag Error:', error);
    },
  });

  return {
    tags,
    createTag: createMutation.mutateAsync,
    updateTag: updateMutation.mutateAsync,
    deleteTag: deleteMutation.mutateAsync,
  };
};

export default useTags;
