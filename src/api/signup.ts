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
