<template>
  <v-navigation-drawer color="primary" permanent>
    <v-list color="primary">
      <v-list-item color="primary" link title="Lumi" to="/" />
      <v-divider />
      <v-list-item
        color="primary"
        link
        prepend-icon="mdi-view-dashboard"
        title="Channel"
        to="/channels"
      />
      <v-list-item
        color="primary"
        link
        prepend-icon="mdi-calendar-blank"
        title="Calendar"
        to="/calendar"
      />
      <v-list-item
        color="primary"
        link
        prepend-icon="mdi-message-outline"
        title="Chat"
        to="/chats"
      />
    </v-list>

    <template #append>
      <v-divider />
      <div class="text-center ma-4 text-caption">
        COPYRIGHT ⓒ {{ new Date().getFullYear() }} BY <strong>YuGuanZhang</strong>
      </div>
    </template>
  </v-navigation-drawer>
  <v-app-bar class="bg-primary-lighten-1" elevation="0">
    <!-- 채널명 필요 -->
    <v-spacer />
    <v-btn variant="plain"> 사용자 이름 </v-btn>
    <v-btn variant="plain" @click="logout"> 로그아웃 </v-btn>
    <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
  </v-app-bar>

  <v-main class="d-flex align-center justify-center">
    <v-container class="fill-height w-100" fluid>
      <v-sheet class="root-content rounded-xl fill-height w-100">
        <slot />
      </v-sheet>
    </v-container>
  </v-main>
</template>
<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

async function logout() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('프론트에서 보낼 refreshToken:', refreshToken);

    if (!refreshToken) {
      alert('저장된 토큰이 없어 로그아웃할 수 없습니다.');
      return;
    }

    // 백엔드에 refreshToken 전달
    await axios.post('http://localhost:8080/api/logout', {
      refreshToken: refreshToken,
    });

    // 클라이언트에서 토큰 제거
    localStorage.removeItem('refreshToken');

    alert('로그아웃 되었습니다.');
    router.push('/login');
  } catch (error) {
    console.error(error);
    alert('로그아웃 실패했습니다.');
  }
}
</script>

<style lang="scss" scoped>
.v-navigation-drawer,
.v-navigation-drawer .v-list,
.v-navigation-drawer .v-list-item {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}
</style>
