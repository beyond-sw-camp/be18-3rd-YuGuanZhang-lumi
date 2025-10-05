<template>
  <v-container class="chat-container" fluid>
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
          <v-divider class="flex-grow-1" />
          <span>{{ formatDate(new Date(chat.createdAt)) }}</span>
          <v-divider class="flex-grow-1" />
        </div>

        <v-row
          class="my-1 align-start"
          :justify="chat.senderId === userId ? 'end' : 'start'"
          no-gutters
        >
          <v-col
            v-if="chat.senderId !== userId && shouldShowAvatar(index)"
            class="pe-2 avatar-col"
            cols="auto"
          >
            <div class="avatar-wrapper">
              <v-avatar class="bg-grey-lighten-3 text-caption text-grey" size="36">
                {{ chat.senderName?.[0] }}
              </v-avatar>
            </div>
          </v-col>

          <v-col class="d-flex flex-column align-start message-col" cols="auto">
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
  if (list.length === 0) return false;
  if (index === 0) return true;

  const prev = list[index - 1];
  const curr = list[index];
  if (!prev?.createdAt || !curr?.createdAt) return false;

  const prevDate = new Date(prev.createdAt);
  const currDate = new Date(curr.createdAt);
  return prevDate.toDateString() !== currDate.toDateString();
}

function shouldShowAvatar(index) {
  if (index === 0) return true;
  const list = chatList.value;
  const prev = list[index - 1];
  const curr = list[index];
  return prev?.senderId !== curr?.senderId;
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
.chat-container {
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 16px;
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

.avatar-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-wrapper {
  display: flex;
  align-items: flex-start;
}

.message {
  max-width: 70%;
}

.message-col {
  display: flex;
  flex-direction: column;
}

.my-bubble {
  border-top-right-radius: 0 !important;
}

.other-bubble {
  border-top-left-radius: 0 !important;
}
</style>
