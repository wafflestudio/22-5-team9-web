const API_BASE_URL = 'https://waffle-instaclone.kro.kr/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  formData?: boolean;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { requiresAuth = true, ...rest } = options;
    let headersObj = { ...options.headers };

    if (requiresAuth) {
      const token = localStorage.getItem('access_token');
      if (token == null) throw new Error('No auth token available');
      headersObj = {
        ...headersObj,
        Authorization: `Bearer ${token}`,
      };
    }

    if (!(options.formData ?? false)) {
      headersObj = {
        'Content-Type': 'application/json',
        ...headersObj,
      };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: headersObj,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      const error = await response.text();
      throw new Error(error);
    }

    return (await response.json()) as T;
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return await this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body:
        data instanceof FormData
          ? data
          : data !== undefined && data !== null
            ? JSON.stringify(data)
            : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body:
        data !== undefined && data !== null ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body:
        data !== undefined && data !== null ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return await this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
