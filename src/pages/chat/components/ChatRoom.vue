<template>
  <v-container class="chat-room-container" fluid>
    <v-row
      v-if="chatList.length === 0"
      align="center"
      class="text-grey text-body-2"
      justify="center"
      style="height: 100%"
    >
      <v-icon class="me-2" color="grey">mdi-message-outline</v-icon>
      채팅 내역이 없습니다.
    </v-row>

    <template v-else>
      <template v-for="(chat, index) in chatList" :key="chat.chatId">
        <div v-if="showDateSeparator(index)" class="date-separator">
          <v-divider class="my-3" />
          <span>{{ formatDate(new Date(chat.createdAt)) }}</span>
          <v-divider class="my-3" />
        </div>

        <v-row class="my-1 ga-1" :justify="chat.senderId === userId ? 'end' : 'start'" no-gutters>
          <v-col v-if="chat.senderId !== userId && shouldShowAvatar(index)" cols="auto">
            <v-avatar class="bg-grey-lighten-3 text-caption text-grey" size="36">
              {{ chat.senderName?.[0] }}
            </v-avatar>
          </v-col>

          <v-col class="message" cols="auto">
            <v-card
              class="pa-2 px-3 rounded-xl"
              :class="chat.senderId === userId ? 'text-white my-bubble' : 'text-black other-bubble'"
              :color="chat.senderId === userId ? 'primary-darken-1' : 'grey-lighten-3'"
            >
              <div class="text-body-2">{{ chat.message }}</div>
            </v-card>
            <div
              class="text-caption text-grey mt-1"
              :class="chat.senderId === userId ? 'text-end' : 'text-start'"
            >
              {{ formatTime(new Date(chat.createdAt)) }}
            </div>
          </v-col>
        </v-row>
      </template>
    </template>
  </v-container>
</template>

<script setup>
// @ts-nocheck
import { computed, unref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getChats } from '@/apis/chat';
import { useApi } from '@/composable/useApi';
import { useAuthStore } from '@/stores/authStore';
import formatDate from '@/utils/formatDate';
import formatTime from '@/utils/formatTime';

const route = useRoute();
const { data: chats, queryFnExecute: useGetChats } = useApi(getChats);
const authStore = useAuthStore();
const userId = computed(() => authStore.tokenInfo.userId);
const roomId = computed(() => route.query.roomId);

const chatList = computed(() => {
  const raw = unref(chats);
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : raw.data;
  return Array.isArray(arr)
    ? arr
        .filter(chat => chat && chat.createdAt)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : [];
});

function showDateSeparator(index) {
  const list = chatList.value;
  if (index === 0) return true;
  const prev = list[index - 1];
  const curr = list[index];
  if (!prev?.createdAt || !curr?.createdAt) return false;
  return new Date(prev.createdAt).toDateString() !== new Date(curr.createdAt).toDateString();
}

function shouldShowAvatar(index) {
  if (index === 0) return true;
  const list = chatList.value;
  return list[index - 1]?.senderId !== list[index]?.senderId;
}

watch(
  () => roomId.value,
  async newVal => {
    if (!newVal) return;
    await useGetChats(newVal);
  },
  { immediate: true },
);
</script>

<style scoped>
.chat-room-container {
  height: 100%;
  overflow-y: auto;
  background-color: #fafafa;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: grey;
  font-size: 12px;
  margin: 16px 0;
}

.date-separator span {
  white-space: nowrap;
  padding: 0 10px;
  border-radius: 8px;
}

.message {
  max-width: 70%;
}

.my-bubble {
  border-top-right-radius: 0 !important;
}

.other-bubble {
  border-top-left-radius: 0 !important;
}
</style>
