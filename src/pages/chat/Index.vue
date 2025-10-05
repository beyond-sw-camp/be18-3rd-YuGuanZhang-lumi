<template>
  <div class="chat-wrapper">
    <ChatRoom class="chat-room" />
    <ChatInput class="chat-input" />
  </div>
</template>

<script setup>
import ChatInput from '@/pages/chat/components/ChatInput.vue';
import ChatRoom from '@/pages/chat/components/ChatRoom.vue';
</script>

<style scoped>
.chat-wrapper {
  display: grid;
  grid-template-rows: 8.5fr 1.5fr;
  height: 100%;
  min-height: 0;
}

.chat-room {
  min-height: 0;
  overflow: auto;
}

.chat-input {
  border-top: 1px solid #e0e0e0;
}
</style>
