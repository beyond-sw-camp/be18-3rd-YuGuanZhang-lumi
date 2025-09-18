<template>
  <v-app class="bg-primary-lighten-1">
    <v-layout class="rounded rounded-md border">
      <SideNavigation v-if="isLogin" app />
      <AppHeader app class="bg-primary-lighten-1" />
      <v-main class="d-flex align-center justify-center">
        <SubLayout>
          <router-view />
        </SubLayout>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import AppHeader from '@/layouts/AppHeader.vue';
import SideNavigation from '@/layouts/SideNavigation.vue';
import SubLayout from '@/layouts/SubLayout.vue';

export default {
  name: 'App',
  components: {
    SideNavigation,
    AppHeader,
    SubLayout,
  },
  computed: {
    isLogin() {
      // 로그인 로직 추가
      return true;
    },
  },
};
</script>
