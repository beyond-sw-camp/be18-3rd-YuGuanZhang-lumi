<template>
  <div class="profileContainer">
    <v-icon class="profile">mdi-account</v-icon>

    <div class="userInfoBox">
      <p><strong>이름:</strong> {{ authStore.tokenInfo.name }}</p>
      <p><strong>이메일:</strong> {{ authStore.tokenInfo.email }}</p>
      <v-btn @click="deleted">회원탈퇴</v-btn>
    </div>
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

async function userInfo() {
  try {
    await authStore.fetchUserInfo();
  } catch (error) {
    console.error(error);
    alert('회원정보 불러오기 실패했습니다.');
  }
}
</script>

<style lang="scss" scoped>
.profileContainer {
  display: flex;
  align-items: flex-start; /* 아이콘과 글씨를 위쪽 정렬 */
  gap: 20px; /* 아이콘과 정보 간격 */
  margin-top: 20px;
}

.profile {
  font-size: 300px; /* 아이콘 크기 */
  color: gray;
}

.userInfoBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
