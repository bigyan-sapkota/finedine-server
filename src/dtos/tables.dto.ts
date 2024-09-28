import { z } from 'zod';

export const createTableSchema = z.object({
  tag: z.string().max(50, 'Too long tag'),
  attribute: z.string().max(100, 'Too long attribute'),
  capacity: z.number().max(12, "Tables can't have more than 12 seats")
});

export const updateTableSchema = createTableSchema
  .extend({ available: z.boolean().optional() })
  .partial();

export const fetchTablesSchema = z.object({ tag: z.string().optional() });

export const fetchAvailableTablesSchema = z.object({
  date: z.string().datetime(),
  hours: z.preprocess((val) => Number(val), z.number().min(1).max(12)),
  tag: z.string().optional()
});
