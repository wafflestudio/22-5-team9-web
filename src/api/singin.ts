import type { User } from '../hooks/useAuth';
import { fetchProfile } from './fetchProfile';

interface SignInResponse {
  access_token: string;
  refresh_token: string;
}

export const signin = async (username: string, password: string): Promise<User> => {
  const response = await fetch('https://waffle-instaclone.kro.kr/api/user/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) {
    const data = (await response.json()) as SignInResponse;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    return await fetchProfile(data.access_token) as User;
  }

  if (response.status === 401) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }

  throw new Error('로그인 중 오류가 발생했습니다.');
};