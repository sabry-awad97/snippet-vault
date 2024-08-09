import { z } from 'zod';
import { commonSchema } from './common';

const baseTagSchema = z.object({
  ...commonSchema.shape,
  name: z.string().min(1, 'Tag name is required'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  snippetIds: z.array(z.string()),
});

export const TagSchema = baseTagSchema.brand<'Tag'>();
export type Tag = z.infer<typeof TagSchema>;
