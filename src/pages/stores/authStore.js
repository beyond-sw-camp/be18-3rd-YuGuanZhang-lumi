// stores/authStore.js
import apiClient from '@/apis/apiClient';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // --- 상태 초기화 ---
  const tokenInfo = reactive({
    accessToken: null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    name: '',
    email: '',
  });

  // --- accessToken 설정 ---
  const setAccessToken = token => {
    tokenInfo.accessToken = token;
    apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;
  };

  // --- 로그아웃 공통 처리 ---
  const performLogout = () => {
    tokenInfo.accessToken = null;
    tokenInfo.refreshToken = null;
    tokenInfo.name = '';
    tokenInfo.email = '';
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers['Authorization'];
  };

  // --- accessToken 재발급 ---
  const refreshAccessToken = async () => {
    if (!tokenInfo.refreshToken) throw new Error('No refresh token');

    try {
      const response = await apiClient.post(
        '/refresh',
        { refreshToken: tokenInfo.refreshToken },
        { _skipInterceptor: true },
      );

      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        tokenInfo.refreshToken = response.data.refreshToken;
        localStorage.setItem('refreshToken', tokenInfo.refreshToken);
      }
    } catch (error) {
      console.error('Refresh token failed', error);
      performLogout();
      throw error;
    }
  };

  // --- 초기화 시 자동 로그인 시도 ---
  if (tokenInfo.refreshToken) {
    refreshAccessToken().catch(() => {
      console.log('자동 로그인 실패, 로그아웃 처리됨');
    });
  }

  // --- 로그인 처리 ---
  const login = async formData => {
    try {
      const response = await apiClient.post('/login', formData, { _skipInterceptor: true });

      if (response.status === 200 && response.data.data?.length) {
        const data = response.data.data[0];
        setAccessToken(data.accessToken);

        tokenInfo.refreshToken = data.refreshToken;
        localStorage.setItem('refreshToken', data.refreshToken);

        return response.data;
      }

      throw new Error(response.data.message);
    } catch (error) {
      console.error('[Login Error]', error.response?.data?.message || error.message);
      throw error;
    }
  };

  // --- 로그아웃 처리 ---
  const logout = async () => {
    if (!tokenInfo.refreshToken) return;

    try {
      await apiClient.post(
        '/logout',
        { refreshToken: tokenInfo.refreshToken },
        { _skipInterceptor: true },
      );
    } catch (error) {
      console.warn('Logout failed', error);
    }

    performLogout();
  };

  // --- 회원가입 ---
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

  // --- 이메일 발송 ---
  const sendEmail = async email => {
    if (!email) throw new Error('이메일을 입력해주세요.');
    return await apiClient.post('/email/send', { email });
  };

  // --- 회원탈퇴 ---
  const deleted = async formData => {
    const response = await apiClient.patch(
      '/user/me',
      { email: formData.email },
      { headers: { Authorization: `Bearer ${tokenInfo.accessToken}` } },
    );

    if (response.status === 200) {
      performLogout();
    }

    return response.data;
  };

  // --- 사용자 프로필 불러오기 ---
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

  // 채널 초대
  const sendInvitation = async (channelId, roleId) => {
    if (!tokenInfo.accessToken) throw new Error('로그인 필요');

    try {
      const payload = { roleId };
      const response = await apiClient.post(`/channels/${channelId}/invitations`, payload, {
        headers: { Authorization: `Bearer ${tokenInfo.accessToken}` },
      });

      return response.data;
    } catch (err) {
      console.error('초대 발송 실패', err);
      throw err;
    }
  };

  return {
    tokenInfo,
    setAccessToken,
    login,
    refreshAccessToken,
    logout,
    sendEmail,
    performLogout,
    signUp,
    fetchProfile,
    deleted,
    sendInvitation,
  };
});
