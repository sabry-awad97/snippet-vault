import { z } from 'zod';

// const objectIdSchema = z.string().refine((val) => ObjectId.isValid(val), {
//   message: "Invalid ObjectId",
// });

export const commonSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
