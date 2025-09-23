<template>
  <div>
    <!-- 상단 영역 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- 정렬 드롭다운 -->
      <v-select
        v-model="sortOrder"
        density="compact"
        :items="['최신순', '오래된순']"
        style="max-width: 120px"
        variant="outlined"
      />

      <!-- 교사만 생성 버튼 -->
      <v-btn
        v-if="userRole === 'TEACHER'"
        color="primary"
        elevation="0"
        rounded="xl"
        @click="goToCreate"
        >과제 생성</v-btn
      >
    </div>

    <!-- 과제 목록 -->
    <AssignmentList
      :assignments="sortedAssignments"
      :user-role="userRole"
      @click="goToDetail"
      @delete="openDeleteModal"
      @edit="goToEdit"
    />

    <!-- 삭제 모달 -->
    <AssignmentDeleteModal
      v-model="deleteDialog"
      :assignment="selectedAssignment"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteAssignment, getAssignments } from '@/apis/assignment';
import AssignmentDeleteModal from './components/AssignmentDeleteModal.vue';
import AssignmentList from './components/AssignmentList.vue';

const route = useRoute();
const router = useRouter();

const channelId = route.params.channelId;
console.log(channelId);

// 상태
const assignments = ref([]);
const sortOrder = ref('최신순'); // 정렬 옵션
const deleteDialog = ref(false);
const selectedAssignment = ref(null);

// ✅ 나중에는 로그인한 사용자 정보에서 role 가져오기
const userRole = ref('TEACHER'); // "TEACHER" | "STUDENT" | "PARENT"

// 목록 불러오기
async function loadAssignments() {
  assignments.value = await getAssignments(channelId);
}

// ✅ 더미 데이터 (나중에 axios로 대체)
// const assignments = ref([
//   {
//     assignmentId: 2,
//     title: 'JPA 과제2',
//     content: '엔티티 매핑과 연관관계 매핑을 학습하는 과제입니다.',
//     deadlineAt: '2025-10-01',
//     evaluationDeadlineAt: '2025-10-08',
//     evaluation: true,
//     submission: false,
//     createdAt: '2025-09-22T10:12:33',
//     updatedAt: '2025-09-23T18:45:00',
//   },
//   {
//     assignmentId: 3,
//     title: 'JPA 과제e2',
//     content: '엔티티 매핑과 연관관계 매핑을 학습하는 과제입니다.',
//     deadlineAt: '2025-10-03',
//     evaluationDeadlineAt: '2025-10-08',
//     evaluation: true,
//     submission: true,
//     createdAt: '2025-09-22T11:00:00',
//     updatedAt: '2025-09-23T20:30:00',
//   },
// ]);

// 정렬된 목록
const sortedAssignments = computed(() => {
  return [...assignments.value].sort(
    (a, b) =>
      sortOrder.value === '최신순'
        ? new Date(b.createdAt) - new Date(a.createdAt) // 최신순
        : new Date(a.createdAt) - new Date(b.createdAt), // 오래된순
  );
});
function goToCreate() {
  router.push(`/channels/${channelId}/assignments/new`);
}
function goToDetail(assignment) {
  router.push(`/channels/${channelId}/assignments/${assignment.assignmentId}`);
  console.log('assignmentId:', assignment.assignmentId);
}
function goToEdit(assignment) {
  router.push(`/channels/${channelId}/assignments/${assignment.assignmentId}/edit`);
}

function openDeleteModal(assignment) {
  selectedAssignment.value = assignment;
  deleteDialog.value = true;
}
async function handleDelete(assignment) {
  await deleteAssignment(channelId, assignment.assignmentId);
  await loadAssignments();
  deleteDialog.value = false;
}

onMounted(() => loadAssignments());
</script>

<style lang="scss" scoped>
.assignment-list {
  background-color: #fdf6ff;
  border-radius: 12px;
  padding: 12px;
}
.assignment-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}
</style>
