import apiClient from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'USER' | 'INSPECTOR';
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'INSPECTOR' | 'USER';
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface InspectorOption {
  id: string;
  email: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload): Promise<{ message: string }> => {
  const { data } = await apiClient.post('/api/auth/register', payload);
  return data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/api/auth/logout', { refreshToken });
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  const { data } = await apiClient.post('/api/auth/refresh', { refreshToken });
  return data;
};

export const getInspectors = async (): Promise<InspectorOption[]> => {
  const { data } = await apiClient.get('/api/auth/inspectors');
  return Array.isArray(data) ? data : [];
};

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>('/api/auth/me');
  return data;
};
