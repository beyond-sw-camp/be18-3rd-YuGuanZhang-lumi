<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-6 rounded-xl shadow-lg" max-width="700" width="100%">
      <!-- 제목 -->
      <v-card-title class="text-h5 font-weight-bold mb-2">
        {{ assignment.title }}
      </v-card-title>
      <v-divider class="mb-4" />

      <!-- 과제 설명 -->
      <v-card-text>
        <div class="mb-4">
          <p class="text-body-1">{{ assignment.content }}</p>
        </div>

        <!-- 기한 정보 -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <strong>제출 마감일:</strong>
            {{ formatDate(assignment.deadlineAt) }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>평가 마감일:</strong>
            {{ formatDate(assignment.evaluationDeadlineAt) }}
          </v-col>
        </v-row>

        <!-- 상태 -->
        <div class="mb-4">
          <v-chip class="mr-2" :color="assignment.submission ? 'success' : 'warning'" size="small">
            {{ assignment.submission ? '제출 가능' : '제출 불가' }}
          </v-chip>
          <v-chip :color="assignment.evaluation ? 'info' : 'grey'" size="small">
            {{ assignment.submission ? '평가 있음' : '평가 없음' }}
          </v-chip>
        </div>

        <!-- 첨부 파일 -->
        <div v-if="assignment.files.length > 0" class="mb-4">
          <h4 class="text-subtitle-1 font-weight-bold">첨부 파일</h4>
          <v-list>
            <v-list-item
              v-for="file in assignment.files"
              :key="file.id"
              :subtitle="(file.size / 1024).toFixed(1) + ' KB'"
              :title="file.name"
              @click="downloadFile(file)"
            >
              <template #prepend>
                <v-icon>mdi-file</v-icon>
              </template>
              <template #append>
                <v-btn color="primary" icon size="small" @click.stop="downloadFile(file)">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-4" />

        <!-- 역할별 버튼 -->
        <div class="d-flex justify-end">
          <!-- 교사 -->
          <template v-if="userRole === 'TEACHER'">
            <v-btn class="mr-2" color="primary" @click="goToEdit"> 수정 </v-btn>
            <v-btn color="red" @click="openDeleteModal">삭제</v-btn>
          </template>

          <!-- 학생 -->
          <template v-else-if="userRole === 'STUDENT'">
            <v-btn color="primary" @click="handleSubmit">제출</v-btn>
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
  <!-- 삭제 모달 -->
  <AssignmentDeleteModal v-model="deleteDialog" :assignment="assignment" @confirm="confirmDelete" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteAssignment, getAssignment } from '@/apis/assignment';
import AssignmentDeleteModal from './components/AssignmentDeleteModal.vue';

const route = useRoute();
const router = useRouter();

const channelId = route.params.channelId;
const assignmentId = route.params.assignmentId;

console.log('assignmentId:', assignmentId);

const userRole = ref('TEACHER');

const assignment = ref({
  assignmentId: null,
  title: '',
  content: '',
  deadlineAt: '',
  evaluationDeadlineAt: '',
  evaluation: false,
  submission: false,
  files: [],
});
const deleteDialog = ref(false);

onMounted(async () => {
  const data = await getAssignment(channelId, assignmentId);
  assignment.value = Array.isArray(data) ? data[0] : data; // 배열 방어 처리
});

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return dateStr.split(' ')[0].replace(/-/g, '.'); // yyyy.MM.dd
}

function downloadFile(file) {
  console.log('파일 다운로드:', file);
  // TODO: 실제 다운로드 API 연동
}

function goToEdit() {
  router.push(`/channels/${channelId}/assignments/${assignmentId}/edit`);
}

function openDeleteModal() {
  deleteDialog.value = true;
}

async function confirmDelete() {
  await deleteAssignment(channelId, assignmentId);
  router.push(`/channels/${channelId}/assignments`);
}

function handleSubmit() {
  console.log('학생 제출 기능 호출');
  // TODO: 제출 API 붙이기
}
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}
</style>
