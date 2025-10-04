import apiClient from '@/apis/apiClient';

export async function getChatRooms() {
  const { data } = await apiClient.get(`/chatrooms`);
  return data.data;
}
