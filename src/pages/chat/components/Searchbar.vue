<template>
  <v-divider class="my-3" />
  <div class="searchbar-container">
    <v-text-field
      v-model="query"
      class="search-input"
      density="compact"
      hide-details
      placeholder="사용자 검색..."
      prepend-inner-icon="mdi-magnify"
      single-line
      variant="plain"
    />

    <div v-if="searchResults.length > 0 && showDropdown" class="result-dropdown">
      <v-list>
        <v-list-item
          v-for="user in searchResults"
          :key="user.userId"
          class="search-item"
          @click="selectUser(user)"
        >
          <template #prepend>
            <v-avatar class="text-white font-weight-bold" color="primary" size="36">
              {{ user.name }}
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-1 font-weight-medium">
            {{ user.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-gray-600">
            {{ user.email }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>
  </div>
  <v-divider class="my-3" />
</template>

<script setup>
// @ts-nocheck
import { ref, watch } from 'vue';
import { getChatUsers } from '@/apis/chat';
import { useApi } from '@/composable/useApi';
import { useDebounce } from '@/composable/useDebounce';

const emit = defineEmits(['user-selected']);

const { data, queryFnExecute: useGetChatUsers } = useApi(getChatUsers);

const query = ref('');

const debouncedQuery = useDebounce(query, 300); // 💫 디바운스 훅 적용
const searchResults = ref([]);
const showDropdown = ref(false);

console.log(searchResults);

// 검색어가 변경될 때마다 API 호출
watch(debouncedQuery, async val => {
  if (!val?.trim()) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }

  await useGetChatUsers(val);
  searchResults.value = data.value || [];
  showDropdown.value = true;
});

function selectUser(user) {
  showDropdown.value = false;
  query.value = '';
  searchResults.value = [];
  emit('user-selected', user);
}
</script>

<style lang="scss" scoped>
.searchbar-container {
  position: relative;
}

.search-input {
  background-color: white !important;
  border-radius: 8px;
  padding: 4px 8px;
}

.search-input .v-field__input {
  padding: 0 !important;
}

.search-input .v-field__field {
  padding: 0 !important;
}

.result-dropdown {
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  z-index: 20;
  border-radius: 8px;
  background-color: white;
}

.search-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
</style>
