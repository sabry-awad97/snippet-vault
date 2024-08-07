import { Tag } from '@/lib/schemas/tag';
import * as tagsApi from '@/lib/tauri/api/tag';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useFetchTags = () => {
  return useQuery<Tag[]>({
    queryKey: ['Tags'],
    queryFn: () => tagsApi.listTags({ filter: {} }),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['createTag'],
    mutationFn: (newTag: Tag) => tagsApi.createTag({ data: newTag }),
    onSuccess: () => {
      toast.success('Tag Created', {
        description: 'Your Tag has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['Tags'] });
      router.refresh();
    },
    onError: error => {
      toast.error('Error', {
        description: 'Failed to create Tag.',
      });
      console.error('Create Tag Error:', error);
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};
