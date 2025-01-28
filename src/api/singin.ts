import { myProfile } from './myProfile';

interface SignInResponse {
  access_token: string;
  refresh_token: string;
}

export const signin = async (username: string, password: string) => {
  const response = await fetch(
    'https://waffle-instaclone.kro.kr/api/user/signin',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  );

  // First check if we got a JSON response
  const contentType = response.headers.get('content-type');
  if ((contentType?.includes('application/json')) === false) {
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error('Server returned non-JSON response');
  }

  if (response.ok) {
		try {
			const data = (await response.json()) as SignInResponse;
			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('refresh_token', data.refresh_token);
			const profileResponse = await myProfile(data.access_token);
			if (profileResponse === null) {
				throw new Error('Failed to fetch user profile');
			}
			return profileResponse;
		} catch (err) {
			console.error('Error parsing JSON response:', err);
			throw new Error('Invalid response format from server');
		}
  }

  if (response.status === 401) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }

  throw new Error('로그인 중 오류가 발생했습니다.');
};
