import { myProfile } from './profile';

interface SignupRequest {
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone_number: string;
}

export const signup = async (formData: SignupRequest) => {
  const response = await fetch('http://3.34.185.81:8000/api/user/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { detail?: string };
    throw new Error(errorData.detail ?? '회원가입에 실패했습니다.');
  }
};

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

  if (response.ok) {
    const data = (await response.json()) as SignInResponse;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    return await myProfile(data.access_token);
  }

  if (response.status === 401) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }

  throw new Error('로그인 중 오류가 발생했습니다.');
};
