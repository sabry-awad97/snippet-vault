import { z } from 'zod';
import { loginSchema } from './auth';
import { commonSchema } from './common';

export const userSchema = z.object({
  ...commonSchema.shape,
  ...loginSchema.shape,
});

export type User = z.infer<typeof userSchema>;
