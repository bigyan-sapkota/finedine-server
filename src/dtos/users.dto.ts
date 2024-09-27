import { z } from 'zod';

const imageRegExp = new RegExp(`(https?://.*.(png|gif|webp|jpeg|jpg))`);
export const imageSchema = z
  .string({ invalid_type_error: 'Invalid image url' })
  .trim()
  .regex(imageRegExp, 'invalid image url')
  .max(300, 'Too long image uri');

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, 'Name must be minimum of 4 characters')
    .max(50, "Name can't exceed 50 characters")
    .transform((name) => name.split(' ').slice(0, 3).join(' '))
    .optional(),
  image: imageSchema.trim().optional(),
  phone: z
    .number()
    .refine((phone) => phone.toString().length === 10, 'Invalid phone number')
    .optional()
});

export const queryUsersSchema = z.object({
  q: z.string().optional(),
  limit: z.preprocess((val) => Number(val) || undefined, z.number().min(1).max(20).default(20)),
  page: z.preprocess((val) => Number(val) || undefined, z.number().min(1).default(1)),
  role: z.enum(['user', 'admin']).optional()
});

export const updateUserSchema = z.object({
  role: z.enum(['user', 'admin'], {
    required_error: 'Please specify role',
    invalid_type_error: 'Invalid role option'
  })
});
