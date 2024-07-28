import { z } from 'zod';
import { commonSchema } from './common';

// Define the base user schema
export const userSchema = z.object({
  ...commonSchema.shape,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  passwordHash: z.string(),
  initials: z
    .string()
    .default('SA')
    .transform(s =>
      s
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2),
    ),
});

// Define the auth schema by picking relevant fields from the user schema and adding password validation
export const authSchema = z.object({
  email: userSchema.shape.email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
});

// Define the register schema by omitting unnecessary fields from the user schema and adding confirmPassword validation
export const registerSchema = userSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    passwordHash: true,
    initials: true,
  })
  .extend({
    password: authSchema.shape.password,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type User = z.infer<typeof userSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
