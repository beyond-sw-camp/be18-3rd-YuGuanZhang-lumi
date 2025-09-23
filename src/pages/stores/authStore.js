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
    try {
      const response = await apiClient.post('/login', formData, { _skipInterceptor: true });

      if (response.status === 200 && response.data.data?.length) {
        Object.assign(tokenInfo, response.data.data[0]);
        localStorage.setItem('refreshToken', tokenInfo.refreshToken);
        return response.data;
      }

      throw new Error(response.data.message);
    } catch (error) {
      // 백엔드에서 보낸 에러 메시지 추출
      const backendMessage = error.response?.data?.message;

      console.error('[Login Error Raw]', backendMessage);

      // 프론트 UI에서 바로 쓸 수 있게 메시지 전달
      throw new Error(backendMessage);
    }
  };

  // 엑세스 토큰 재발급
  const refreshAccessToken = async () => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (!savedRefreshToken) throw new Error('No refresh token');

    const response = await apiClient.post(
      '/refresh',
      { refreshToken: savedRefreshToken },
      { _skipInterceptor: true },
    );
    if (response.status === 200) {
      Object.assign(tokenInfo, response.data);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (!savedRefreshToken) return;

    const response = await apiClient.post(
      '/logout',
      { refreshToken: savedRefreshToken },
      { _skipInterceptor: true },
    );

    if (response.status === 200) {
      performLogout();
      localStorage.removeItem('refreshToken');
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

  // 회원탈퇴
  const deleted = async formData => {
    const payload = {
      email: formData.email,
    };

    const response = await apiClient.patch('/user/me', payload, {
      headers: {
        Authorization: `Bearer ${tokenInfo.accessToken}`,
      },
    });

    if (response.status === 200) {
      performLogout();
      localStorage.removeItem('refreshToken');
    }

    return response.data;
  };

  // 사용자 이름
  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/user/profile');

      const profile = response.data.data[0];
      tokenInfo.name = profile.name;
      tokenInfo.email = profile.email;

      return profile;
    } catch (error) {
      console.error('프로필 불러오기 실패', error);
      throw error;
    }
  };

  return {
    tokenInfo,
    login,
    refreshAccessToken,
    logout,
    performLogout,
    sendEmail,
    signUp,
    deleted,
    fetchProfile,
  };
});
