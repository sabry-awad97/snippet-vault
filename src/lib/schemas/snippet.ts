import { z } from 'zod';
import { commonSchema } from './common';

export const snippetSchema = z.object({
  ...commonSchema.shape,
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  code: z.string().min(1, 'Code is required'),
  tags: z.array(z.string().min(1, 'Tag is required')).default([]),
});

export const snippetFormSchema = snippetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Snippet = z.infer<typeof snippetSchema>;
export type SnippetFormData = z.infer<typeof snippetFormSchema>;
