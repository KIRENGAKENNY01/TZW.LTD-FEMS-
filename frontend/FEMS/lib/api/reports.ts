import apiClient from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface InventoryReport {
  total: number;
  byType: Record<string, number>;
  byStatus: {
    ACTIVE: number;
    INACTIVE: number;
    EXPIRED: number;
    UNDER_MAINTENANCE: number;
  };
  byBuilding: Record<string, number>;
}

export interface InspectionReport {
  pending: number;
  completed: number;
  overdue: number;
  cancelled: number;
  completionRate: number;
  byInspector: Array<{
    inspectorId: string;
    inspectorName: string;
    count: number;
  }>;
  monthly?: Array<{
    month: string;
    completed: number;
    scheduled: number;
  }>;
}

export interface ComplianceReport {
  expired: number;
  expiringThisMonth: number;
  expiringNext30Days: number;
  compliantPercentage: number;
}

export interface MaintenanceReport {
  totalActivities: number;
  lastThirtyDays: number;
  recentActivities: Array<{
    id: string;
    actionTaken: string;
    maintenanceDate: string;
    extinguisherSerial?: string;
  }>;
}

export interface ExportJob {
  id: string;
  status: string;
  format: string;
  downloadUrl?: string;
}

export const getInventoryReport = async (params?: {
  period?: string;
}): Promise<InventoryReport> => {
  const { data } = await apiClient.get('/api/reports/inventory', { params });
  return data;
};

export const getInspectionReport = async (): Promise<InspectionReport> => {
  const { data } = await apiClient.get('/api/reports/inspections');
  return data;
};

export const getComplianceReport = async (): Promise<ComplianceReport> => {
  const { data } = await apiClient.get('/api/reports/compliance');
  return data;
};

export const getMaintenanceReport = async (): Promise<MaintenanceReport> => {
  const { data } = await apiClient.get('/api/reports/maintenance');
  return data;
};

export const exportReport = async (
  type: 'inventory' | 'inspection' | 'compliance' | 'maintenance',
  format: 'PDF' | 'CSV',
  personal = false,
): Promise<ExportJob> => {
  const path = personal
    ? `/api/reports/my/${type}/export`
    : `/api/reports/${type}/export`;
  const { data } = await apiClient.post<any>(path, { format });
  return {
    ...data,
    downloadUrl: data.fileUrl,
  };
};

export const getExportJobStatus = async (jobId: string): Promise<ExportJob> => {
  const { data } = await apiClient.get<any>(`/api/reports/exports/${jobId}`);
  return {
    ...data,
    downloadUrl: data.fileUrl,
  };
};

export const getExportDownloadUrl = (filename: string) =>
  `${API_BASE_URL}/api/reports/exports/download/${filename}`;
