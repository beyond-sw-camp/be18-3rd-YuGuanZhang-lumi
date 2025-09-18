<template>
  <v-app-bar>
    <v-spacer />
    <v-btn variant="plain"> 사용자 이름 </v-btn>
    <v-btn variant="plain"> 로그아웃 </v-btn>
    <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
  </v-app-bar>
</template>

<script></script>

<style lang="scss" scoped>
.v-btn::before {
  background-color: transparent;
}
</style>
