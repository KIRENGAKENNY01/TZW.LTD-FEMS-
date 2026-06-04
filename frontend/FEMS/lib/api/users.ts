import apiClient from './client';
import { normalizeList, type ListResult } from './list';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  updatedAt?: string;
}

export type UserListResponse = ListResult<UserProfile>;

export const getUsers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<UserListResponse> => {
  const { data } = await apiClient.get('/api/users', { params });
  return normalizeList<UserProfile>(data);
};

export const updateUserRole = async (
  userId: string,
  role: 'ADMIN' | 'INSPECTOR' | 'USER',
): Promise<{ id: string; role: string }> => {
  const { data } = await apiClient.patch(`/api/users/${userId}/role`, { role });
  return data;
};

export const deactivateUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/users/${id}`);
};
