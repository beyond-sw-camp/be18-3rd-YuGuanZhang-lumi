<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item link title="Lumi" to="/" />
      <v-divider />
      <v-list-item
        link
        prepend-icon="mdi-view-dashboard"
        title="Channel"
        to="/channels"
      />
      <v-list-item link prepend-icon="mdi-calendar-blank" title="Calendar" to="/calendar" />
      <v-list-item link prepend-icon="mdi-message-outline" title="Chat" to="/chats" />
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
.v-list-item--active {
  background-color: transparent !important;
  color: inherit !important;
}
</style>
