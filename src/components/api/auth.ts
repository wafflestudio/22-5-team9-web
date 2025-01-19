import type { UserProfile } from '../../types/user';
import { apiClient } from './client';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>('/user/signin', credentials, {
      requiresAuth: false,
    });
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>(
      '/user/refresh',
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
        requiresAuth: false,
      },
    );
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    return await apiClient.get<UserProfile>('/user/profile');
  },
};
