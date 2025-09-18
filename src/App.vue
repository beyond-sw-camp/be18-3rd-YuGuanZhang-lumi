<template>
  <v-card>
    <v-layout class="rounded rounded-md border">
      <SideNavigation v-if="isLogin"></SideNavigation>
      <AppHeader />
      <v-main class="d-flex align-center justify-center">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import AppHeader from '@/layouts/AppHeader.vue';
import SideNavigation from '@/layouts/SideNavigation.vue';

export default {
  name: 'App',
  components: {
    SideNavigation,
    AppHeader,
  },
  computed: {
    isLogin() {
      // 로그인 로직 추가
      return true;
    },
  },
};
</script>
