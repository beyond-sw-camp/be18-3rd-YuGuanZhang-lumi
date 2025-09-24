<template>
  <v-container class="pa-6" fluid>
    <h2 class="text-h6 font-weight-bold mb-4">제출물</h2>
    <v-divider class="mb-4" />

    <!-- 제출이 없으면 생성 -->
    <SubmissionCreate
      v-if="!submission && userRole === 'STUDENT'"
      mode="create"
      @submitted="loadSubmission"
    />

    <!-- 제출이 있을 때 -->
    <div v-else-if="submission">
      <!-- 제목 / 설명 -->
      <div class="mb-4">
        <div class="font-weight-bold text-body-1">{{ submission.title }}</div>
        <div class="text-body-2 text-grey">{{ submission.description }}</div>
      </div>

      <!-- 파일 목록 -->
      <div v-if="submission.files && submission.files.length > 0" class="mb-4">
        <h4 class="text-subtitle-1 font-weight-bold">첨부 파일</h4>
        <v-list>
          <v-list-item v-for="file in submission.files" :key="file.fileId" :title="file.fileName">
            <template #prepend>
              <v-icon>mdi-file</v-icon>
            </template>
            <template #append>
              <v-btn color="primary" icon size="small" @click.stop="download(file)">
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
          <v-btn color="primary" @click="goToEvaluate">평가</v-btn>
        </template>

        <!-- 학생 -->
        <template v-else-if="userRole === 'STUDENT'">
          <v-btn class="mr-2" color="primary" @click="openEdit">수정</v-btn>
          <v-btn color="red" @click="openDeleteModal">삭제</v-btn>
        </template>
      </div>
    </div>

    <!-- 수정 모달 -->
    <v-dialog v-model="editDialog" max-width="640">
      <SubmissionUpdate
        v-if="submission"
        class="submissionCreateClass"
        :in-dialog="true"
        :initial-data="submission"
        mode="edit"
        @close="editDialog = false"
        @submitted="
          updated => {
            submission = updated;
          }
        "
      />
    </v-dialog>

    <!-- 삭제 모달 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>제출 삭제</v-card-title>
        <v-card-text> "{{ submission?.title }}" 제출을 삭제하시겠습니까? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">취소</v-btn>
          <v-btn color="red" @click="handleDelete">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { downloadFile } from '@/apis/file';
import { deleteSubmission, getSubmission, updateSubmission } from '@/apis/submission';
import SubmissionCreate from './SubmissionCreate.vue';
import SubmissionUpdate from './SubmissionUpdate.vue';

const route = useRoute();
const router = useRouter();

const channelId = route.params.channelId;
const assignmentId = route.params.assignmentId;

// TODO: 나중에 authStore로 교체
const userRole = ref('STUDENT');

const submission = ref(null);
const editDialog = ref(false);
const deleteDialog = ref(false);

async function loadSubmission() {
  try {
    const data = await getSubmission(channelId, assignmentId);
    submission.value = Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.log('제출 없음', error);
    submission.value = null;
  }
}
async function onEdited(payload) {
  // 수정 API 호출
  const updated = await updateSubmission(
    channelId,
    assignmentId,
    submission.value.submissionId,
    payload,
  );
  submission.value = updated;
  editDialog.value = false; // 모달 닫기
}

function openEdit() {
  editDialog.value = true;
}

function goToEvaluate() {
  router.push(
    `/channels/${channelId}/assignments/${assignmentId}/submissions/${submissionId}/evaluate`,
  );
}

function openDeleteModal() {
  deleteDialog.value = true;
}

async function handleDelete() {
  await deleteSubmission(channelId, assignmentId, submission.value.submissionId);
  submission.value = null; // 삭제 후 → 다시 제출 폼 보이도록
  deleteDialog.value = false;
}
function download(file) {
  downloadFile(file.fileId, file.fileName);
}

onMounted(() => loadSubmission());
</script>

<style scoped>
.submission-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}

.submissionCreateClass {
  background-color: aliceblue;
}
</style>
