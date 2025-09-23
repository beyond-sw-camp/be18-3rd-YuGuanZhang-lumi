<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <vue-cal
          style="height: 600px"
          view="month"
          :views="{ month: {} }"
          @cell-click="onDateClick"
        />
      </v-col>

      <v-col cols="4">
        <v-card class="pa-6" max-width="500">
          <v-card-title class="text-h6 mb-4">일정 등록/수정</v-card-title>

          <v-form v-model="valid">
            <!-- 수업 시작 날짜/시간 -->
            <v-row align="center" class="mb-4">
              <v-col cols="4">수업 시작 날짜/시간</v-col>
              <v-col>
                <v-text-field
                  v-model="form.startDate"
                  density="compact"
                  type="datetime-local"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- 수업 종료 날짜/시간 -->
            <v-row align="center" class="mb-4">
              <v-col cols="4">수업 종료 날짜/시간</v-col>
              <v-col>
                <v-text-field
                  v-model="form.endDate"
                  density="compact"
                  type="datetime-local"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- 장소 -->
            <v-row align="center" class="mb-4">
              <v-col cols="4">장소</v-col>
              <v-col>
                <v-text-field
                  v-model="form.location"
                  density="compact"
                  placeholder="장소 입력"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- 상태 -->
            <v-row align="center" class="mb-6">
              <v-col cols="4">상태</v-col>
              <v-col>
                <v-select
                  v-model="form.status"
                  density="compact"
                  :items="['SCHEDULED', 'ABSENT', 'ILLENES', 'ATTEND']"
                  placeholder="상태 선택"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- 버튼 -->
            <v-row class="mt-6" justify="center">
              <v-col class="d-flex justify-center" cols="6">
                <v-btn color="primary" variant="flat" @click="submitForm">일정 등록</v-btn>
              </v-col>
              <v-col class="d-flex justify-center" cols="6">
                <v-btn color="grey" variant="flat" @click="cancelForm">취소</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="overflow-auto" style="max-height: 470px; min-height: 200px">
          <v-list class="py-0">
            <!-- 일정 있음 -->
            <template v-if="schedule && schedule.length > 0">
              <template v-for="(item, i) in schedule" :key="`${item.entityType}-${item.entityId}`">
                <v-divider v-if="i !== 0" />

                <v-list-item>
                  <!-- 공통 헤더 -->
                  <v-list-item-title>
                    [{{ item.channelName }}] {{ item.entityType }} ({{ item.roleName }})
                  </v-list-item-title>

                  <!-- COURSE -->
                  <v-list-item-subtitle v-if="item.entityType === 'COURSE'">
                    일정 : {{ item.startDate || '-' }} ~ {{ item.endDate || '-' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </template>

            <!-- 일정 없음 -->
            <template v-else>
              <v-list-item>
                <v-list-item class="text-center text-grey">
                  <v-list-item-title>등록된 일정이 없습니다.</v-list-item-title>
                </v-list-item>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showDeleteModal" max-width="400">
      <v-card>
        <v-card-title>정말 삭제하시겠습니까?</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="confirmDelete">삭제하기</v-btn>
          <v-btn color="grey" text @click="cancelDelete">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { VueCal } from 'vue-cal';
import { getCalendar } from '@/apis/calendar';
import { useApi } from '@/composable/useApi';
import formatDate from '@/utils/formatDate';
import 'vue-cal/style';

const { data: calendar, queryFnExecute: useGetCalendar } = useApi(getCalendar);

const form = ref({
  startDate: '',
  endDate: '',
  location: '',
  status: null,
});

const schedule = ref();
const newTask = ref(null);
const selectedDate = ref(formatDate(new Date()));

const showDeleteModal = ref(false);
const taskToDeleteId = ref(null);

onMounted(async () => {
  await refreshData();
});

async function refreshData(date = selectedDate.value) {
  await useGetCalendar(date);

  if (!Array.isArray(calendar.value)) return;

  schedule.value = calendar.value.map(item => ({
    channelId: item.channelId,
    channelName: item.channelName,
    entityId: item.entityId,
    entityType: item.entityType,
    roleName: item.roleName,
    location: item.location,
    statusType: item.statusType,
    startDate: item.startDate,
    endDate: item.endDate,
    deadlineAt: item.deadlineAt,
    isSubmission: item.isSubmission,
    evaluationDeadlineAt: item.evaluationDeadlineAt,
    isEvaluation: item.isEvaluation,
  }));
}

async function onDateClick({ cell }) {
  const clickedDate = formatDate(cell.start);
  selectedDate.value = clickedDate;
  await refreshData(clickedDate);
}

function editTask(task) {
  // editingTodoId.value = task.todoId;
  // editingText.value = task.description;
}

async function saveEdit(todoId) {
  try {
    // await useUpdateTodo(todoId, { description: editingText.value });
    // task.description = editingText.value;
  } catch (error) {
    console.error('수정 실패', error);
  } finally {
    // editingTodoId.value = null;
  }
}

async function updateStatus(task) {
  try {
    // const newStatus = !task.status;
    // await useUpdateTodo(task.todoId, { status: newStatus });
    // task.status = newStatus;
  } catch {
    // console.error('상태 변경 실패', error);
  }
}

function askDelete(todoId) {
  showDeleteModal.value = true;
  taskToDeleteId.value = todoId;
}

async function confirmDelete() {
  const todoId = taskToDeleteId.value;
  if (!todoId) return;

  try {
    // await useDeleteTodo(todoId);
    // tasks.value = tasks.value.filter(task => task.todoId !== todoId); // 즉시 반영
  } catch (error) {
    console.error('삭제 실패', error);
  } finally {
    showDeleteModal.value = false;
    taskToDeleteId.value = null;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  taskToDeleteId.value = null;
}
</script>

<style lang="scss" scoped>
.vuecal {
  --vuecal-primary-color: #d4aaff;
  .vuecal__scrollable--month-view {
    .vuecal__event {
      height: 15px;
      margin-top: 1px;
    }
    .vuecal__event-details {
      font-size: 11px;
      white-space: nowrap;
      padding: 0;
    }

    .vuecal__cell--has-events {
      flex-direction: row-reverse;
      overflow: hidden;
      justify-content: flex-start;
    }

    .vuecal__cell--has-events .vuecal__cell-date {
      align-self: flex-start;
    }
  }
}
</style>
