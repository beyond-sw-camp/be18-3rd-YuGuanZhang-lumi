import { defineStore } from 'pinia';
import { reactive } from 'vue';
// stores/authStore.js
import apiClient from '@/apis/apiClient';

export const useAuthStore = defineStore('auth', () => {
  // --- 상태 초기화 ---
  const tokenInfo = reactive({
    accessToken: null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    name: '',
    email: '',
    userId: null,
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
    tokenInfo.userId = null;
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
        await fetchProfile();
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
        await fetchProfile();

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

      // @ts-ignore
      tokenInfo.userId = profile.userId;
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
    } catch (error) {
      console.error('초대 발송 실패', error);
      throw error;
    }
  };

  // 참여자 목록
  const fetchParticipants = async channelId => {
    if (!tokenInfo.accessToken) throw new Error('로그인 필요');

    try {
      const response = await apiClient.get(`/channels/${channelId}/participants`, {
        headers: { Authorization: `Bearer ${tokenInfo.accessToken}` },
      });

      // 🔹 데이터에 name과 email 추가 (백엔드에서 DTO에 포함했다고 가정)
      return response.data?.data || [];
    } catch (error) {
      console.error('참여자 목록 불러오기 실패:', error);
      return [];
    }
  };

  // 참여자 삭제
  const deleteSelfFromChannel = async channelId => {
    if (!tokenInfo.accessToken) throw new Error('로그인 필요');

    try {
      const response = await apiClient.delete(`/channels/${channelId}/participants/me`, {
        headers: {
          Authorization: `Bearer ${tokenInfo.accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('참여자 삭제 실패:', error);
      throw error;
    }
  };

  // 참여자 상세 조회
  const fetchChannelUser = async (channelId, userId) => {
    if (!tokenInfo.accessToken) throw new Error('로그인 필요');
    try {
      const response = await apiClient.get(`/channels/${channelId}/participants/${userId}`, {
        headers: { Authorization: `Bearer ${tokenInfo.accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error('참여자 상세 조회 실패:', error);
      throw error;
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
    fetchParticipants,
    deleteSelfFromChannel,
    fetchChannelUser,
  };
});
