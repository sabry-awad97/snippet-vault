import { z } from 'zod';
import { commonSchema } from './common';
import { TagSchema } from './tag';

const baseSnippetStateSchema = z.object({
  id: z.string(),
  isFavorite: z.boolean(),
  isDark: z.boolean(),
});

export const SnippetStateSchema =
  baseSnippetStateSchema.brand<'SnippetState'>();

// Define the snippet schema with common fields and additional validations
const baseSnippetSchema = z.object({
  ...commonSchema.shape, // Spreading common schema fields
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  language: z.string().min(1, 'Language is required'),
  code: z.string().min(1, 'Code is required'),
  tagIds: z.array(z.string()),
  snippetStateId: z.string(),
});

// Brand the base schema
export const SnippetSchema = baseSnippetSchema
  .extend({
    tags: TagSchema.array().optional(),
    state: SnippetStateSchema.optional(),
  })
  .brand<'Snippet'>();

// TypeScript types inferred from schemas
export type Snippet = z.infer<typeof SnippetSchema>;
export type SnippetState = z.infer<typeof SnippetStateSchema>;
