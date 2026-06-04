import apiClient from './client';
import { normalizeList, type ListResult } from './list';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationListResponse = ListResult<Notification>;

export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
}): Promise<NotificationListResponse> => {
  const { data } = await apiClient.get('/api/notifications', { params });
  return normalizeList<Notification>(data);
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const { data } = await apiClient.get('/api/notifications/unread-count');
  return data;
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const { data } = await apiClient.patch(`/api/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async (): Promise<{ message: string }> => {
  const { data } = await apiClient.patch('/api/notifications/read-all');
  return data;
};
