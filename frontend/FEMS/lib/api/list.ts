import type { PaginationMeta } from './client';

export interface ListResult<T> {
  data: T[];
  pagination?: PaginationMeta;
}

export function normalizeList<T>(
  payload: T[] | ListResult<T> | null | undefined,
): ListResult<T> {
  if (!payload) return { data: [] };
  if (Array.isArray(payload)) return { data: payload };
  return {
    data: payload.data ?? [],
    pagination: payload.pagination,
  };
}
