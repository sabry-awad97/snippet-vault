import { Snippet, SnippetSchema } from '@/lib/schemas/snippet';
import { invokeCommand } from '@/lib/tauri/invoke';
import {
  DeleteParams,
  GetParams,
  ListParams,
  PostParams,
  PutParams,
} from '@/lib/tauri/types';

type SnippetForm = Omit<Snippet, 'id' | 'created_at' | 'updated_at'>;
type SnippetStateUpdate = Partial<Snippet['state']>;

interface SnippetFilter {
  title?: string;
}

export async function createSnippet(
  params: PostParams<SnippetForm>,
): Promise<Snippet> {
  return await invokeCommand('create_snippet', params);
}

export async function getSnippet(params: GetParams): Promise<Snippet> {
  const response = await invokeCommand('get_snippet', params);
  return await SnippetSchema.parseAsync(response);
}

export async function listSnippets(
  params: ListParams<SnippetFilter> = {},
): Promise<Snippet[]> {
  const response = await invokeCommand('list_snippets', params);
  return await SnippetSchema.array().parseAsync(response);
}

export async function updateSnippet(
  params: PutParams<SnippetForm>,
): Promise<Snippet> {
  const response = await invokeCommand('update_snippet', params);
  return await SnippetSchema.parseAsync(response);
}

export async function deleteSnippet(params: DeleteParams): Promise<Snippet> {
  const response = await invokeCommand('delete_snippet', params);
  return await SnippetSchema.parseAsync(response);
}

export async function updateSnippetState(
  params: PutParams<SnippetStateUpdate>,
): Promise<Snippet> {
  const response = await invokeCommand('update_snippet_state', params);
  return await SnippetSchema.parseAsync(response);
}
