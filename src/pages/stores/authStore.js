// stores/authStore.js
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import apiClient from '@/apis/apiClient';

export const useAuthStore = defineStore('auth', () => {
  const tokenInfo = reactive({
    accessToken: '',
    refreshToken: '',
    name: '',
    email: '',
  });

  // 새로고침 시 localStorage에서 토큰 불러오기
  const savedAccessToken = localStorage.getItem('accessToken');
  const savedRefreshToken = localStorage.getItem('refreshToken');
  if (savedAccessToken) {
    tokenInfo.accessToken = savedAccessToken;
    apiClient.defaults.headers['Authorization'] = `Bearer ${savedAccessToken}`;
  }
  if (savedRefreshToken) {
    tokenInfo.refreshToken = savedRefreshToken;
  }

  // 로그인 처리
  const login = async formData => {
    try {
      // @ts-ignore
      const response = await apiClient.post('/login', formData, { _skipInterceptor: true });

      if (response.status === 200 && response.data.data?.length) {
        Object.assign(tokenInfo, response.data.data[0]);

        localStorage.setItem('refreshToken', tokenInfo.refreshToken);

        // apiClient 기본 헤더에 토큰 세팅
        apiClient.defaults.headers['Authorization'] = `Bearer ${tokenInfo.accessToken}`;
        return response.data;
      }

      throw new Error(response.data.message);
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      console.error('[Login Error]', backendMessage);
      throw new Error(backendMessage || error.message);
    }
  };

  // accessToken 재발급
  const refreshAccessToken = async () => {
    if (!tokenInfo.refreshToken) throw new Error('No refresh token');

    const response = await apiClient.post(
      '/refresh',
      { refreshToken: tokenInfo.refreshToken },
      // @ts-ignore
      { _skipInterceptor: true },
    );

    if (response.status === 200) {
      tokenInfo.accessToken = response.data.accessToken;
      tokenInfo.refreshToken = response.data.refreshToken;

      localStorage.setItem('accessToken', tokenInfo.accessToken);
      localStorage.setItem('refreshToken', tokenInfo.refreshToken);

      apiClient.defaults.headers['Authorization'] = `Bearer ${tokenInfo.accessToken}`;
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    if (!tokenInfo.refreshToken) return;

    try {
      await apiClient.post(
        '/logout',
        { refreshToken: tokenInfo.refreshToken },
        // @ts-ignore
        { _skipInterceptor: true },
      );
    } catch (error) {
      console.warn('Logout failed', error);
    }

    performLogout();
  };

  // 공통 로그아웃
  const performLogout = () => {
    tokenInfo.accessToken = '';
    tokenInfo.refreshToken = '';
    tokenInfo.name = '';
    tokenInfo.email = '';

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    apiClient.defaults.headers['Authorization'] = '';
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

  // 이메일
  const sendEmail = async email => {
    if (!email) throw new Error('이메일을 입력해주세요.');
    const response = await apiClient.post('/email/send', { email });
    return response;
  };

  // 회원탈퇴
  const deleted = async formData => {
    const payload = { email: formData.email };

    const response = await apiClient.patch('/user/me', payload, {
      headers: { Authorization: `Bearer ${tokenInfo.accessToken}` },
    });

    if (response.status === 200) {
      performLogout();
      localStorage.removeItem('refreshToken');
    }

    return response.data;
  };

  // 사용자 프로필 불러오기
  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/user/profile');
      const profile = response.data.data[0];

      tokenInfo.name = profile.name;
      tokenInfo.email = profile.email;

      return profile;
    } catch (error) {
      console.error('Fetch profile failed', error);
      throw error;
    }
  };

  return {
    tokenInfo,
    login,
    refreshAccessToken,
    logout,
    sendEmail,
    performLogout,
    signUp,
    fetchProfile,
    deleted,
  };
});
