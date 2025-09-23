<template>
  <div>
    <v-btn @click="deleted">회원탈퇴</v-btn>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

async function deleted() {
  try {
    await authStore.deleted({ email: authStore.tokenInfo.email });
    alert('회원탈퇴 되었습니다.');
    router.push('/channel');
  } catch (error) {
    console.error(error);
    alert('회원탈퇴 실패했습니다.');
  }
}
</script>

<style lang="scss" scoped></style>
