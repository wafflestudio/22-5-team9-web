import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { signin } from '../api/auth';
import { myProfile } from '../api/profile';
import GoogleAuth from '../components/auth/GoogleAuth';
import type { UserProfile } from '../types/user';

type LoginPageProps = {
  handleIsLoggedIn: (value: boolean, userData: UserProfile) => void;
};

const LoginPage = ({ handleIsLoggedIn }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const user = await signin(username, password);
      handleIsLoggedIn(true, user);
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.',
      );
    }
  };

  const handleGoogleError = (err: string) => {
    setError(err);
  };

  const handleGoogleSuccess = async (
    access_token: string,
    refresh_token: string,
  ) => {
    try {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      const profileResponse = await myProfile(access_token);
      if (profileResponse == null) {
        throw new Error('Failed to fetch user profile');
      }
      handleIsLoggedIn(true, profileResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Google 로그인 중 오류가 발생했습니다.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-red-500">
          Insnugram
        </h1>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => void handleSubmit(e)}>
            {error.length > 0 && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                전화번호, 사용자 이름 또는 이메일
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 hover:from-purple-600 hover:via-pink-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                로그인
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleAuth
                onSuccess={(access_token, refresh_token) => {
                  void handleGoogleSuccess(access_token, refresh_token);
                }}
                onError={handleGoogleError}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-center">
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                계정이 없으신가요? 가입하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
