<template>
  <v-container fluid>
    <v-row>
      <!-- 달력 -->
      <v-col cols="8">
        <vue-cal
          event-count
          :events="events"
          style="height: 600px"
          view="month"
          @cell-click="onDateClick"
        />
        <template #event-count="{ events: cellEvents }">
          <span v-if="events.some(event => !event.allCompleted)">
            {{ cellEvents.reduce((sum, event) => sum + (event.incompleteCount || 0), 0) }}
          </span>
        </template>
      </v-col>

      <v-col cols="4">
        <div>
          <div class="mb-2">할 일 ({{ selectedDate }})</div>

          <v-text-field v-model="newTask" label="할 일을 입력하세요." variant="solo">
            <template #append-inner>
              <v-fade-transition>
                <v-btn v-show="newTask" icon="mdi-plus-circle" variant="text" @click="createTask" />
              </v-fade-transition>
            </template>
          </v-text-field>

          <v-divider class="mb-4"></v-divider>

          <v-card v-if="tasks.length > 0" class="overflow-auto" style="max-height: 470px">
            <v-list class="py-0">
              <template v-for="(task, i) in tasks" :key="task.todoId">
                <v-divider v-if="i !== 0" />

                <v-list-item>
                  <template #prepend>
                    <v-checkbox-btn
                      color="grey"
                      :model-value="task.status"
                      @click.stop
                      @update:model-value="() => updateStatus(task)"
                    />
                  </template>

                  <v-list-item-title>
                    <!-- 수정 중 -->
                    <span v-if="editingTodoId === task.todoId">
                      <v-text-field
                        v-model="editingText"
                        dense
                        hide-details
                        variant="underlined"
                        @click.stop
                        @keydown.enter.prevent="saveEdit(task.todoId)"
                      />
                    </span>

                    <span v-else :class="{ 'text-grey': task.status }">
                      {{ task.description }}
                    </span>
                  </v-list-item-title>

                  <template #append>
                    <v-menu>
                      <template #activator="{ props }">
                        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop />
                      </template>
                      <v-list>
                        <v-list-item class="text-button" @click="editTask(task)">
                          수정하기
                        </v-list-item>
                        <v-list-item class="text-button" @click="askDelete(task.todoId)">
                          삭제하기
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </div>
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
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '@/apis/calendar';
import { useApi } from '@/composable/useApi';
import formatDate from '@/utils/formatDate';
import 'vue-cal/style';

const events = ref([]);
const tasks = ref([]);
const newTask = ref(null);
const selectedDate = ref(formatDate(new Date()));

const editingTodoId = ref(null);
const editingText = ref('');
const showDeleteModal = ref(false);
const taskToDeleteId = ref(null);

const { data: todos, queryFnExecute: useGetTodos } = useApi(getTodos);
const { data: todo, queryFnExecute: useGetTodo } = useApi(getTodo);
const { queryFnExecute: useCreateTodo } = useApi(createTodo);
const { queryFnExecute: useUpdateTodo } = useApi(updateTodo);
const { queryFnExecute: useDeleteTodo } = useApi(deleteTodo);

onMounted(async () => {
  await refreshData();
});

async function refreshData(date = selectedDate.value) {
  await useGetTodos();
  await useGetTodo(date);

  if (!Array.isArray(todos.value)) return;
  if (!Array.isArray(todo.value)) return;

  events.value = todos.value.map(item => ({
    start: item.dueDate,
    end: item.dueDate,
    title: `${item.incompleteCount}`,
    incompleteCount: item.incompleteCount,
    allCompleted: item.allCompleted,
  }));

  tasks.value = todo.value.map(item => ({
    todoId: item.todoId,
    description: item.description,
    status: item.status,
  }));
}

async function onDateClick({ cell }) {
  const clickedDate = formatDate(cell.start);
  selectedDate.value = clickedDate;
  await refreshData(clickedDate);
}

async function createTask() {
  if (!newTask.value) return;
  try {
    const created = await useCreateTodo({
      description: newTask.value,
      status: false,
      dueDate: selectedDate.value,
    });
    console.log('created', created);
    tasks.value.push(created[0]);
    newTask.value = null;
  } catch (error) {
    console.error('생성 실패', error);
  }
}

function editTask(task) {
  editingTodoId.value = task.todoId;
  editingText.value = task.description;
}

async function saveEdit(todoId) {
  const task = tasks.value.find(t => t.todoId === todoId);
  if (!task) return;

  try {
    await useUpdateTodo(todoId, { description: editingText.value });
    task.description = editingText.value;
  } catch (error) {
    console.error('수정 실패', error);
  } finally {
    editingTodoId.value = null;
  }
}

async function updateStatus(task) {
  try {
    const newStatus = !task.status;
    await useUpdateTodo(task.todoId, { status: newStatus });
    task.status = newStatus;
  } catch (error) {
    console.error('상태 변경 실패', error);
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
    await useDeleteTodo(todoId);
    tasks.value = tasks.value.filter(task => task.todoId !== todoId); // 즉시 반영
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
