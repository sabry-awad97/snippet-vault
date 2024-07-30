import { z } from 'zod';
import { commonSchema } from './common';

const NoteStateSchema = z.object({
  isFavorite: z.boolean().default(false),
  isDark: z.boolean().default(false),
});

// Define the snippet schema with common fields and additional validations
const baseSnippetSchema = z.object({
  ...commonSchema.shape, // Spreading common schema fields
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  code: z.string().min(1, 'Code is required'),
  tags: z.array(z.string().min(1, 'Tag is required')).default([]),
  state: NoteStateSchema,
});

// Brand the base schema
export const snippetSchema = baseSnippetSchema.brand<'Snippet'>();

// TypeScript types inferred from schemas
export type Snippet = z.infer<typeof snippetSchema>;
