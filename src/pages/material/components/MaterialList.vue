<template>
  <v-list class="material-list">
    <MaterialCard
      v-for="m in materials"
      :key="m.materialId"
      :channel="channel"
      :material="m"
      @click="$emit('click', m)"
      @delete="$emit('delete', m)"
      @edit="$emit('edit', m)"
    />
  </v-list>
</template>

<script setup>
import MaterialCard from './MaterialCard.vue';

defineProps({
  materials: Array,
  channel: { type: Object, default: () => ({}) },
});

defineEmits(['edit', 'delete', 'click']);
</script>

<style lang="scss" scoped></style>
