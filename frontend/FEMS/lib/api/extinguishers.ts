import apiClient from './client';
import { normalizeList, type ListResult } from './list';

export interface Extinguisher {
  id: string;
  serialNumber: string;
  type: string;
  size?: string;
  location: string;
  building?: string | null;
  floor?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'UNDER_MAINTENANCE';
  expiryDate: string;
  lastInspectionDate?: string;
  installationDate?: string;
  notes?: string | null;
  registeredBy?: string;
  assignedUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ExtinguisherListResponse = ListResult<Extinguisher>;

export const getExtinguishers = async (params?: {
  status?: string;
  building?: string;
  page?: number;
  limit?: number;
}): Promise<ExtinguisherListResponse> => {
  const { data } = await apiClient.get('/api/extinguishers', { params });
  return normalizeList<Extinguisher>(data);
};

export const getExpiringSoon = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ExtinguisherListResponse> => {
  const { data } = await apiClient.get('/api/extinguishers/expiring-soon', { params });
  return normalizeList<Extinguisher>(data);
};

export const getExpired = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ExtinguisherListResponse> => {
  const { data } = await apiClient.get('/api/extinguishers/expired', { params });
  return normalizeList<Extinguisher>(data);
};

export const createExtinguisher = async (
  payload: Record<string, unknown>,
): Promise<Extinguisher> => {
  const { data } = await apiClient.post('/api/extinguishers', payload);
  return data;
};

export const updateExtinguisher = async (
  id: string,
  payload: Record<string, unknown>,
): Promise<Extinguisher> => {
  const { data } = await apiClient.put(`/api/extinguishers/${id}`, payload);
  return data;
};

export const deleteExtinguisher = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/extinguishers/${id}`);
};

export const updateExtinguisherStatus = async (
  id: string,
  status: string,
): Promise<Extinguisher> => {
  const { data } = await apiClient.patch(`/api/extinguishers/${id}/status`, { status });
  return data;
};

export const assignExtinguisher = async (
  id: string,
  assignedUserId: string | null,
): Promise<Extinguisher> => {
  const { data } = await apiClient.patch(`/api/extinguishers/${id}/assign`, {
    assignedUserId,
  });
  return data;
};
