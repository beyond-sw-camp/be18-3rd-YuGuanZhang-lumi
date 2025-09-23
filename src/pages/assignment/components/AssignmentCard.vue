<template>
  <v-list-item class="assignment-item" @click="$emit('click', assignment)">
    <div class="d-flex justify-space-between align-center w-100">
      <div>
        <div class="font-weight-bold">{{ assignment.title }}</div>
        <small class="text-grey">마감일: {{ assignment.deadlineAt }}</small>
        <div class="text-caption mt-1">
          생성: {{ assignment.createdAt }} / 수정: {{ assignment.updatedAt }}
        </div>
        <div class="text-caption mt-1">{{ assignment.content }}</div>
      </div>

      <div class="d-flex align-center">
        <v-chip v-if="assignment.submission" class="mr-2" color="success" size="small">
          제출 완료
        </v-chip>
        <v-chip v-else class="mr-2" color="warning" size="small">미제출</v-chip>

        <v-chip v-if="assignment.evaluation" class="mr-2" color="info" size="small">
          평가 있음
        </v-chip>

        <!-- 역할별 버튼 -->
        <template v-if="userRole === 'TEACHER'">
          <v-btn
            class="mr-2"
            color="primary"
            size="small"
            variant="flat"
            @click.stop="$emit('edit', assignment)"
            >수정</v-btn
          >
          <v-btn color="red" size="small" variant="flat" @click.stop="$emit('delete', assignment)"
            >삭제</v-btn
          >
        </template>
        <v-btn v-else-if="userRole === 'STUDENT'" color="primary" size="small" variant="flat">
          제출
        </v-btn>
      </div>
    </div>
  </v-list-item>
</template>

<script setup>
defineProps({
  assignment: Object,
  userRole: String,
});
defineEmits(['edit', 'delete', 'click']);
</script>

<style lang="scss" scoped>
.assignment-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}
</style>
