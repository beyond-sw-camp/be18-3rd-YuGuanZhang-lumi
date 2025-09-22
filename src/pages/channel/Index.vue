<template>
  <div>
    안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

console.log('Access Token:', authStore.tokenInfo.accessToken);
</script>

<style lang="scss" scoped></style>
