<template>
  <v-list class="assignment-list">
    <AssignmentCard
      v-for="a in assignments"
      :key="a.assignmentId"
      :assignment="a"
      :user-role="userRole"
      @click="$emit('click', a)"
      @delete="$emit('delete', a)"
      @edit="$emit('edit', a)"
    />
  </v-list>
</template>

<script setup>
import AssignmentCard from './AssignmentCard.vue';

defineProps({
  assignments: Array,
  userRole: String,
});

defineEmits(['edit', 'delete', 'click']);
</script>

<style lang="scss" scoped></style>
