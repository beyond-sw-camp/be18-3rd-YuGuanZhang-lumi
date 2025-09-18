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
  <v-app-bar class="bg-primary-lighten-1" flat>
    <!-- 채널명 필요 -->
    <v-spacer />
    <v-btn variant="plain"> 사용자 이름 </v-btn>
    <v-btn variant="plain"> 로그아웃 </v-btn>
    <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
  </v-app-bar>

  <v-main class="pa-4">
    <v-sheet class="custom-sheet">
      <slot />
    </v-sheet>
  </v-main>
</template>
<script setup></script>

<style lang="scss" scoped>
.v-navigation-drawer,
.v-navigation-drawer .v-list,
.v-navigation-drawer .v-list-item {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}
.custom-sheet {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  box-sizing: border-box;
  margin: 20px;
}
</style>
