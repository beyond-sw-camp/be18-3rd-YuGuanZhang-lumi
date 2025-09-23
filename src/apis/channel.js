import api from './axios';

// 채널 목록 조회
export async function getChannels(page = 0, size = 20) {
  const { data } = await api.get('/channels', {
    params: { page, size, sort: 'createdAt,desc' },
  });
  return data.data; // ✅ 백엔드에서 data 배열 반환
}

// 채널 생성
export async function createChannel(payload) {
  const { data } = await api.post('/channels', payload);
  return data.data; // ✅ 생성된 채널 데이터 배열
}

// 채널 수정
export async function updateChannel(channelId, payload) {
  const { data } = await api.put(`/channels/${channelId}`, payload);
  return data.data;
}

// 채널 삭제
export async function deleteChannel(channelId) {
  const { data } = await api.delete(`/channels/${channelId}`);
  return data.data;
}
