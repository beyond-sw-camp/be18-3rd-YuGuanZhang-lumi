<template>
  <div>
    <!-- 상단 등록하기 버튼 -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="#ffe8ff" elevation="0" @click="openCreateModal"> 채널 등록하기 </v-btn>
    </div>

    <!-- 채널 카드 목록 -->
    <v-container fluid>
      <v-row>
        <v-col v-for="channel in channels" :key="channel.channelId" cols="12" md="4" sm="6">
          <ChannelCard
            :channel="channel"
            @click="goToClasses(channel)"
            @delete="openDeleteModal"
            @edit="openEditModal"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- 등록/수정 모달 -->
    <ChannelFormModal
      v-model="formDialog"
      :channel="selectedChannel"
      :mode="formMode"
      @submit="handleSubmit"
    />

    <!-- 삭제 모달 -->
    <ChannelDeleteModal v-model="deleteDialog" :channel="selectedChannel" @delete="handleDelete" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { createChannel, deleteChannel, getChannels, updateChannel } from '@/apis/channel';

import ChannelCard from './components/ChannelCard.vue';
import ChannelDeleteModal from './components/ChannelDeleteModal.vue';
import ChannelFormModal from './components/ChannelFormModal.vue';

const router = useRouter();
const channels = ref([]);

// 더미 데이터
// const channels = ref([
//   { id: 1, name: '프론트엔드 스터디', subject: 'Vue.js' },
//   { id: 2, name: '백엔드 프로젝트', subject: 'Spring Boot' },
//   { id: 3, name: '알고리즘 모임', subject: '자료구조' },
// ]);

// 등록/수정 모달
const formDialog = ref(false);
const formMode = ref('create'); // "create" | "edit"
const selectedChannel = ref(null);

// 삭제 모달
const deleteDialog = ref(false);

// ✅ 채널 목록 불러오기
async function loadChannels() {
  channels.value = await getChannels();
}

onMounted(() => loadChannels());

function openCreateModal() {
  formMode.value = 'create';
  selectedChannel.value = null;
  formDialog.value = true;
}

function openEditModal(channel) {
  formMode.value = 'edit';
  selectedChannel.value = channel;
  formDialog.value = true;
}

function openDeleteModal(channel) {
  selectedChannel.value = channel;
  deleteDialog.value = true;
}

function goToClasses(channel) {
  router.push(`/channels/${channel.channelId}/classes`);
}

// ✅ 등록/수정 처리 (삼항 연산자 사용)
async function handleSubmit(newData) {
  formMode.value === 'create'
    ? await createChannel(newData)
    : await updateChannel(selectedChannel.value.channelId, newData);

  await loadChannels();
  formDialog.value = false;
}

// ✅ 삭제 처리
async function handleDelete(channel) {
  await deleteChannel(channel.channelId);
  await loadChannels();
  deleteDialog.value = false;
}
</script>

<style lang="scss" scoped></style>
