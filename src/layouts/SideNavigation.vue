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
</template>
<script setup></script>

<style lang="scss" scoped>
.v-navigation-drawer,
.v-navigation-drawer .v-list,
.v-navigation-drawer .v-list-item {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important; // 글씨 색상 대비
}
// .v-list-item--active {
//   background-color: rgba(255, 255, 255, 0.2) !important; // 활성화 시 강조 효과
// }
</style>
