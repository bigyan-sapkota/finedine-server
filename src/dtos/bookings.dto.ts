import { z } from 'zod';

const dateSchema = z
  .string()
  .datetime()
  .transform((startsAt) => {
    const date = new Date(startsAt);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  })
  .refine((startsAt) => {
    const date = new Date(startsAt);
    if (date.getTime() < Date.now()) return false;
    if (date.getMinutes() % 15 !== 0) return false;
  }, 'Invalid date selected');

const bookTableSchema = z.object({
  tableId: z.string(),
  startsAt: dateSchema,
  endsAt: dateSchema
});
const adminBookTableSchema = bookTableSchema.extend({ userId: z.string() });
export const bookTablesSchema = z
  .array(bookTableSchema)
  .min(1, 'Select at least one table for booking')
  .max(5, "Can't book more than 5 tables at once");
export const adminBookTablesSchema = z
  .array(adminBookTableSchema)
  .min(1, 'Select at least one table for booking')
  .max(5, "Can't book more than 5 tables at once");

export const getBookingsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.preprocess((val) => Number(val) || undefined, z.number().min(1).max(20).default(20)),
  isCancelled: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  userId: z.string().optional(),
  tableId: z.string().optional()
});

export type GetBookingsQuerySchema = z.infer<typeof getBookingsQuerySchema>;
