import { z } from 'zod';

export const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

export const paginationSchema = z.object({
  page: z.preprocess(val => parseInt(val || '1', 10), z.number().int().min(1).default(1)),
  limit: z.preprocess(val => parseInt(val || '20', 10), z.number().int().min(1).max(100).default(20))
});

export const idParamSchema = z.object({
  params: z.object({
    id: uuidSchema
  })
});

export const commonPaginationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional()
  })
});
