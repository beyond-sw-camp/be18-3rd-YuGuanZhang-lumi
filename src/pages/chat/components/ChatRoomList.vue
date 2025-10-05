<template>
  <v-list class="fill-height" density="compact" lines="two" nav>
    <v-list-item-title>
      <div class="d-flex align-center justify-space-between w-100">
        <span>내 채팅방</span>
        <v-chip>{{ chatRoomList?.length }}</v-chip>
      </div>
    </v-list-item-title>

    <Searchbar />

    <v-list-item
      v-for="room in chatRoomList"
      :key="room.roomId"
      :subtitle="room.lastMessage"
      :title="room.roomName"
      @click="openChatRoom(room.roomId)"
    >
      <template #prepend>
        <v-avatar class="d-flex align-center justify-center font-weight-bold bg-white" size="36">
          <span class="text-grey">{{ room.opponentName }}</span>
        </v-avatar>
      </template>

      <template #append>
        <v-icon v-if="room.hasUnread" class="text-error" icon="mdi-circle" size="10" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getChatRooms } from '@/apis/chat';
import { useApi } from '@/composable/useApi';
import Searchbar from '@/pages/chat/components/Searchbar.vue';

const router = useRouter();

const { data: chatRoomList, queryFnExecute: useGetChatRooms } = useApi(getChatRooms);

function openChatRoom(roomId) {
  router.push({ path: '/chats', query: { roomId } });
}

onMounted(async () => {
  await useGetChatRooms();
});
</script>

<style scoped></style>
