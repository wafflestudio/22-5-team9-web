export const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (storedRefreshToken == null) throw new Error('No refresh token found');
    const response = await fetch(
      'https://waffle-instaclone.kro.kr/api/user/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedRefreshToken}`,
        },
      },
    );

    if (!response.ok) throw new Error('Refresh failed');

    const { access_token, refresh_token } = (await response.json()) as {
      access_token: string;
      refresh_token: string;
    };
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return access_token;
  } catch (error) {
    // If refresh token is invalid, force logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};
