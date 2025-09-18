<template>
  <v-container class="fill-height pa-4 w-100" fluid>
    <v-sheet class="sub-layout rounded-xl fill-height w-100">
      <v-tabs v-if="showTabs" v-model="tab" color="primary">
        <v-tab v-for="item in TABS" :key="item.to" replace :to="item.to">
          {{ item.label }}
        </v-tab>
      </v-tabs>

      <!-- 실제 콘텐츠 영역 -->
      <div class="pa-4 fill-height">
        <slot />
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tab = ref(null);

const currentChannelId = computed(() => route.params.channelId);

const showTabs = computed(() => route.path.startsWith('/channels/'));

const TABS = computed(() => {
  const channelId = currentChannelId.value;

  if (!channelId) return [];

  return [
    { label: '수업 일정', to: `/channels/${channelId}/classes` },
    { label: '수업 과제', to: `/channels/${channelId}/assignments` },
    { label: '수업 자료', to: `/channels/${channelId}/materials` },
    { label: '참여자', to: `/channels/${channelId}/participants` },
  ];
});
</script>

<style scoped lang="scss">
.sub-layout {
  border: 1px solid rgba(0, 0, 0, 0.12) !important; /* 확실히 적용 */
  background-color: #fff;
}
</style>
