import { z } from 'zod';

const baseTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export const TagSchema = baseTagSchema.brand<'Tag'>();
export type Tag = z.infer<typeof TagSchema>;
