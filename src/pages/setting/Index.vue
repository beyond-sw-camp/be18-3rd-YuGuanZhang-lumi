<template>
  <div class="profileContainer">
    <v-icon class="profile">mdi-account</v-icon>
    <v-btn @click="deleted">회원탈퇴</v-btn>
    <v-btn @click="userInfo" class="userInfo">사용자 정보</v-btn>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>사용자 정보</v-card-title>
        <v-card-text>
          <p><strong>UUID:</strong> {{ user?.userId }}</p>
          <p><strong>이름:</strong> {{ user?.name }}</p>
          <p><strong>이메일:</strong> {{ user?.email }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const dialog = ref(false);
const user = ref(null);

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
    const profile = await authStore.fetchUserInfo();
    user.value = profile;
    dialog.value = true;
  } catch (error) {
    console.error(error);
    alert('회원정보 불러오기 실패했습니다.');
  }
}
</script>

<style lang="scss" scoped>
.profileContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.profile {
  font-size: 250px;
  margin-bottom: 20px;
}

.userInfo {
  margin: 20px;
}
</style>
