const API_BASE_URL = 'https://waffle-instaclone.kro.kr/api';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

async function refreshTokens() {
  try {
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (storedRefreshToken == null) throw new Error('No refresh token');

    const response = await fetch(`${API_BASE_URL}/user/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Refresh failed');

    const { access_token, refresh_token } =
      (await response.json()) as TokenResponse;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return access_token;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const accessToken = localStorage.getItem('access_token');

  // Add auth header if token exists
  const headers = {
    ...options.headers,
    ...(accessToken != null && { Authorization: `Bearer ${accessToken}` }),
  };

  let response = await fetch(url, { ...options, headers });

  // If unauthorized, try refresh
  if (response.status === 401) {
    try {
      const newToken = await refreshTokens();
      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch {
      // Refresh failed - clear auth and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';
      throw new Error('Authentication expired');
    }
  }

  return response;
}
