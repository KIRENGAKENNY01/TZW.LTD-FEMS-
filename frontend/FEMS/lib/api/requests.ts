import apiClient from './client';
import { normalizeList, type ListResult } from './list';

export interface ExtinguisherRequest {
  id: string;
  userId: string;
  type: 'NEW' | 'REPLACEMENT' | 'INSTALLATION';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  details?: string | null;
  adminComment?: string | null;
  building?: string | null;
  floor?: string | null;
  location?: string | null;
  size?: string | null;
  extinguisherType?: string | null;
  extinguisherId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RequestListResponse = ListResult<ExtinguisherRequest>;

export const getRequests = async (params?: {
  page?: number;
  limit?: number;
}): Promise<RequestListResponse> => {
  const { data } = await apiClient.get('/api/extinguishers/requests', { params });
  return normalizeList<ExtinguisherRequest>(data);
};

export const createRequest = async (
  payload: Record<string, unknown>,
): Promise<ExtinguisherRequest> => {
  const { data } = await apiClient.post<ExtinguisherRequest>('/api/extinguishers/requests', payload);
  return data;
};

export const getRequestById = async (id: string): Promise<ExtinguisherRequest> => {
  const { data } = await apiClient.get<ExtinguisherRequest>(`/api/extinguishers/requests/${id}`);
  return data;
};

export const reviewRequest = async (
  id: string,
  payload: Record<string, unknown>,
): Promise<{ request: ExtinguisherRequest; extinguisher?: any }> => {
  const { data } = await apiClient.patch<{ request: ExtinguisherRequest; extinguisher?: any }>(
    `/api/extinguishers/requests/${id}/review`,
    payload,
  );
  return data;
};
