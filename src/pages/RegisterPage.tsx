import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { signup } from '../api/signup';
import { signin } from '../api/singin';
import type { User } from '../hooks/useAuth';

type RegisterPageProps = {
  handleIsLoggedIn: (value: boolean, userData: User) => void;
};

const RegisterPage = ({ handleIsLoggedIn }: RegisterPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
    phoneNumber: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      fullName: '',
      username: '',
      password: '',
      phoneNumber: '',
    };

    if (formData.email.length === 0) {
      newErrors.email = '이메일을 입력해주세요';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
      isValid = false;
    }

    if (formData.fullName.length === 0) {
      newErrors.fullName = '성명을 입력해주세요';
      isValid = false;
    }

    if (formData.username.length === 0) {
      newErrors.username = '사용자 이름을 입력해주세요';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자 이름은 3자 이상이어야 합니다';
      isValid = false;
    }

    if (formData.password.length === 0) {
      newErrors.password = '비밀번호를 입력해주세요';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
      isValid = false;
    }

    if (formData.phoneNumber.length === 0) {
      newErrors.phoneNumber = '전화번호를 입력해주세요';
      isValid = false;
    } else if (!/^010\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '유효한 전화번호를 입력해주세요 (010XXXXXXXX)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      await signup({
        username: formData.username,
        password: formData.password,
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
      });
  
      const user = await signin(formData.username, formData.password);
      handleIsLoggedIn(true, user);
      await navigate('/');
    } catch (error) {
      console.error('Registration/Login failed:', error);
      setErrors((prev) => ({
        ...prev,
        username: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors].length > 0) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-red-500">
          Instagram
        </h1>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => void handleSubmit(e)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.email.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                성명
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.fullName.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                사용자 이름
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.username.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                전화번호
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.phoneNumber.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.password.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 hover:from-purple-600 hover:via-pink-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                가입하기
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-sm text-center">
              <Link
                to="/"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                이미 계정이 있으신가요? 로그인하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
