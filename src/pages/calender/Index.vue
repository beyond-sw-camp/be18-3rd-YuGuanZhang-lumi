<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <vue-cal
          v-model:view="view"
          :events="events"
          events-on-month-view
          style="height: 600px"
          :views="['week', 'month']"
          @ready="({ view }) => onViewChange(view)"
          @view-change="onViewChange"
        >
        </vue-cal>
        <template #events-count="{ events }">
          <span v-if="customEventsCount(events)">
            {{ customEventsCount(events) }}
          </span>
        </template>
      </v-col>
      <v-col cols="4">
        <div>
          <div class="mb-2">할 일</div>
          <v-text-field
            v-model="newTask"
            label="할 일을 입력하세요."
            variant="solo"
            @keydown.enter="create"
          >
            <template #append-inner>
              <v-fade-transition>
                <v-btn
                  v-show="newTask"
                  icon="mdi-plus-circle"
                  variant="text"
                  @click="create"
                ></v-btn>
              </v-fade-transition>
            </template>
          </v-text-field>
          <v-divider class="mb-4"></v-divider>
          <v-card v-if="tasks.length > 0" class="overflow-auto" style="max-height: 470px">
            <v-list class="py-0" group leave-absolute="" tag="v-list">
              <template v-for="(task, i) in tasks" :key="`${i}-${task.text}`">
                <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                <v-list-item @click="task.done = !task.done">
                  <template #prepend>
                    <v-checkbox-btn v-model="task.done" color="grey" @click.stop />
                  </template>

                  <v-list-item-title>
                    <span v-if="editingIndex === i">
                      <v-text-field
                        v-model="editingText"
                        dense
                        hide-details
                        variant="underlined"
                        @click.stop
                        @keydown.enter="saveEdit(i)"
                      />
                    </span>
                    <span v-else :class="{ 'text-grey': task.done }">
                      {{ task.text }}
                    </span>
                  </v-list-item-title>

                  <template #append>
                    <v-expand-x-transition>
                      <v-icon v-if="task.done" color="success">mdi-check</v-icon>
                    </v-expand-x-transition>
                    <v-menu>
                      <template #activator="{ props }">
                        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop />
                      </template>
                      <v-list>
                        <v-list-item class="text-button" @click="editTask(task, i)">
                          수정하기
                        </v-list-item>
                        <v-list-item class="text-button" @click="askDelete(i)">
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
    <v-col>
      <v-container class="pa-0" fluid>일정 자세하게</v-container>
    </v-col>

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
import { computed, ref } from 'vue';
import { VueCal } from 'vue-cal';
import 'vue-cal/style';

const events = ref([
  {
    start: '2018-11-21',
    end: '2018-11-21',
    title: 'Need to go shopping',
    content: '<i class="icon material-icons">shopping_cart</i>',
    class: 'leisure',
  },
  {
    start: '2018-11-21',
    end: '2018-11-21',
    title: 'Golf with John',
    content: '<i class="icon material-icons">golf_course</i>',
    class: 'sport',
  },
  {
    start: '2018-11-22',
    end: '2018-11-22',
    title: "Dad's birthday!",
    content: '<i class="icon material-icons">cake</i>',
    class: 'sport',
  },
]);

const view = ref('month');

function onViewChange(viewObj) {
  // viewObj.start, viewObj.end을 이용해 events.value 갱신 가능
  console.log('view changed:', viewObj);
}

// =================================
const tasks = ref([
  {
    done: false,
    text: 'Foobar',
  },
  {
    done: false,
    text: 'Fizzbuzz',
  },
]);
const newTask = ref(null);

function create() {
  tasks.value.push({
    done: false,
    text: newTask.value,
  });
  newTask.value = null;
}

const editingIndex = ref(null);
const editingText = ref('');

function editTask(task, index) {
  editingIndex.value = index;
  editingText.value = task.text;
}

function saveEdit(index) {
  tasks.value[index].text = editingText.value;
  editingIndex.value = null;
}

const showDeleteModal = ref(false);
const taskToDeleteIndex = ref(null);

function askDelete(index) {
  showDeleteModal.value = true;
  taskToDeleteIndex.value = index;
}

function confirmDelete() {
  tasks.value.splice(taskToDeleteIndex.value, 1);
  showDeleteModal.value = false;
  taskToDeleteIndex.value = null;
}

function cancelDelete() {
  showDeleteModal.value = false;
  taskToDeleteIndex.value = null;
}
</script>

<style lang="scss" scoped>
.vuecal {
  --vuecal-primary-color: #d4aaff;
}
</style>
