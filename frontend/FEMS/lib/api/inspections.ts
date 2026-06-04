import apiClient from './client';
import { normalizeList, type ListResult } from './list';

export interface Inspection {
  id: string;
  extinguisherId: string;
  inspectorId: string;
  scheduledBy?: string;
  status: 'REQUESTED' | 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  scheduledDate: string;
  scheduledTime?: string;
  completedAt?: string;
  completedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  extinguisher?: {
    serialNumber: string;
    location: string;
    building?: string;
    floor?: string;
  };
  inspector?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  maintenanceLog?: MaintenanceLog | null;
}

export interface MaintenanceLog {
  id: string;
  inspectionId: string;
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  issuesIdentified?: string;
  recommendations?: string;
  conditionsNoted?: string;
  maintenanceDate: string;
  createdAt?: string;
  inspection?: Inspection;
}

export type InspectionListResponse = ListResult<Inspection>;
export type MaintenanceLogListResponse = ListResult<MaintenanceLog>;

export const getInspections = async (params?: {
  status?: string;
  inspectorId?: string;
  extinguisherId?: string;
  page?: number;
  limit?: number;
}): Promise<InspectionListResponse> => {
  const { data } = await apiClient.get('/api/inspections', { params });
  return normalizeList<Inspection>(data);
};

export const createInspection = async (payload: {
  extinguisherId: string;
  inspectorId?: string | null;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}): Promise<Inspection> => {
  const { data } = await apiClient.post('/api/inspections', payload);
  return data;
};

export const completeInspection = async (id: string): Promise<Inspection> => {
  const { data } = await apiClient.patch(`/api/inspections/${id}/complete`);
  return data;
};

export const approveInspection = async (
  id: string,
  payload: { inspectorId: string },
): Promise<Inspection> => {
  const { data } = await apiClient.patch(`/api/inspections/${id}/approve`, payload);
  return data;
};

export const logMaintenance = async (
  inspectionId: string,
  payload: {
    actionTaken: string;
    issuesIdentified?: string;
    recommendations?: string;
    conditionsNoted?: string;
    maintenanceDate: string;
  },
): Promise<MaintenanceLog> => {
  const { data } = await apiClient.post(
    `/api/inspections/${inspectionId}/maintenance`,
    payload,
  );
  return data;
};

export const getMaintenanceLogs = async (params?: {
  inspectorId?: string;
  page?: number;
  limit?: number;
}): Promise<MaintenanceLogListResponse> => {
  const { data } = await apiClient.get('/api/inspections/maintenance', { params });
  return normalizeList<MaintenanceLog>(data);
};
