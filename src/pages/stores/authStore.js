import apiClient from '../api';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const tokenInfo = reactive({
    accessToken: '',
    name: '',
    email: '',
    refreshToken: '',
  });

  const savedRefreshToken = localStorage.getItem('refreshToken');
  if (savedRefreshToken) {
    tokenInfo.refreshToken = savedRefreshToken;
  }

  // 로그인 처리
  const login = async formData => {
    const response = await apiClient.post('/login', formData, {});

    if (response.status === 200) {
      Object.assign(tokenInfo, response.data.data[0]);
      localStorage.setItem('refreshToken', tokenInfo.refreshToken);
      console.log('[Login] tokenInfo:', tokenInfo);
    }

    return response.data;
  };

  // 엑세스 토큰 재발급
  const refreshAccessToken = async () => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (!savedRefreshToken) throw new Error('No refresh token');

    const response = await apiClient.post(
      '/refresh',
      { refreshToken: savedRefreshToken }, // JSON body
      { _skipInterceptor: true },
    );

    if (response.status === 200) {
      Object.assign(tokenInfo, response.data);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    const response = await apiClient.post('/logout', null, {});

    if (response.status === 204) {
      performLogout();
    }

    return response;
  };

  // 공통 로그아웃 처리 함수
  const performLogout = () => {
    // 사용자 정보 초기화
    tokenInfo.accessToken = '';
    tokenInfo.name = '';
    tokenInfo.email = '';
    tokenInfo.refreshToken = '';
  };

  const sendEmail = async email => {
    if (!email) throw new Error('이메일을 입력해주세요.');
    const response = await apiClient.post('/email/send', { email });
    return response;
  };

  // 회원가입
  const signUp = async formData => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isPrivacyAgreement: formData.agree,
    };
    const response = await apiClient.post('/sign-up', payload);
    return response.data;
  };

  return {
    tokenInfo,
    login,
    refreshAccessToken,
    logout,
    performLogout,
    sendEmail,
    signUp,
  };
});
