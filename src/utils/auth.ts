const API_BASE_URL = 'https://waffle-instaclone.kro.kr/api';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshTokens(): Promise<string> {
  // If already refreshing, return the existing promise
  if (isRefreshing && (refreshPromise != null)) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (storedRefreshToken == null) throw new Error('No refresh token');
  
      const response = await fetch(`${API_BASE_URL}/user/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedRefreshToken}`,
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Refresh failed:', errorText);
        throw new Error(`Refresh failed: ${response.status}`);
      }
  
      const { access_token, refresh_token } =
        (await response.json()) as TokenResponse;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return access_token;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/';
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let accessToken = localStorage.getItem('access_token');
  console.debug('Initial access token:', (accessToken != null) ? accessToken.slice(0, 10) + '...' : 'none');

  // Add auth header if token exists
  const headers = {
    ...options.headers,
    ...(accessToken != null && { Authorization: `Bearer ${accessToken}` }),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  let response = await fetch(url, { ...options, headers, mode: 'cors', credentials: 'include' });

  // If unauthorized, try refresh
  if (response.status === 401) {
    try {
      accessToken = await refreshTokens();
      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
        mode: 'cors',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Request failef after token refresh: ${response.status}`);
      }
    } catch(err) {
      // Refresh failed - clear auth and redirect to login
      console.error('Authentication error:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/';
      throw new Error('Authentication expired');
    }
  }

  return response;
}

export function initializeTokenCheck() {
  const checkToken = async () => {
    const token = localStorage.getItem('access_token');
    
    if (token == null) {
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/';
      return;
    }

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/user/profile`);
      
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.error('Token check failed:', error);
      try {
        await refreshTokens();
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/';
      }
    }
  };
  // Run initial check
  void checkToken();

  return setInterval(() => { void checkToken(); }, 4 * 60 * 1000);
}