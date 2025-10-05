import apiClient from '@/apis/apiClient';

export async function getChatRooms() {
  const { data } = await apiClient.get(`/chatrooms`);
  return data.data;
}

export async function getChatUsers(query) {
  const { data } = await apiClient.get(`/chatrooms/users/search?query=${query}`);
  return data.data;
}

export async function getChats(roomId) {
  const { data } = await apiClient.get(`/chatrooms/${roomId}`);

  return data.data;
}
