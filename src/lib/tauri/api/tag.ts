import { Tag, TagSchema } from '@/lib/schemas/tag';
import { invokeCommand } from '@/lib/tauri/invoke';
import {
  DeleteParams,
  GetParams,
  ListParams,
  PostParams,
  PutParams,
} from '@/lib/tauri/types';

type TagForm = Omit<Tag, 'id' | 'created_at' | 'updated_at' | 'snippetIds'>;

interface TagFilter {
  name?: string;
}

export async function createTag(params: PostParams<TagForm>): Promise<Tag> {
  const response = await invokeCommand('create_tag', params);
  return await TagSchema.parseAsync(response);
}

export async function getTag(params: GetParams): Promise<Tag> {
  const response = await invokeCommand('get_tag', params);
  return await TagSchema.parseAsync(response);
}

export async function listTags(
  params: ListParams<TagFilter> = {},
): Promise<Tag[]> {
  const response = await invokeCommand('list_tags', params);
  return await TagSchema.array().parseAsync(response);
}

export async function updateTag(params: PutParams<TagForm>): Promise<Tag> {
  const response = await invokeCommand('update_tag', params);
  return await TagSchema.parseAsync(response);
}

export async function deleteTag(params: DeleteParams): Promise<Tag> {
  const response = await invokeCommand('delete_tag', params);
  return await TagSchema.parseAsync(response);
}
