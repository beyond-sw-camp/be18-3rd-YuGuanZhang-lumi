<template>
  <v-container class="chat-input pa-2" fluid>
    <div class="input-row">
      <div class="text-area">
        <v-textarea
          v-model="message"
          class="message-field"
          density="compact"
          hide-details
          max-rows="3"
          no-resize
          placeholder="메시지를 입력하세요..."
          rows="1"
          variant="plain"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.shift.enter.stop
        />
      </div>

      <div class="send-area">
        <v-btn
          class="send-btn rounded-xl"
          color="primary"
          :disabled="isDisabled"
          size="large"
          @click="sendMessage"
        >
          전송
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';

const message = ref('');
const isDisabled = computed(() => !message.value.trim());

function sendMessage() {
  const text = message.value.trim();
  if (!text) return;
  console.log('📤 보낸 메시지:', text);
  message.value = '';
}
</script>

<style scoped>
.chat-input {
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.input-row {
  display: flex;
  align-items: stretch;
  gap: 8px;
  height: 100%;
}

.text-area {
  flex: 1 1 auto;
  min-width: 0;
}

.message-field {
  width: 100%;
  height: 100%;
}

.send-btn {
  width: 100%;
  height: 100%;
}

:deep(.message-field .v-field),
:deep(.message-field .v-field__input),
:deep(.message-field textarea) {
  padding: 0 !important;
}
:deep(.send-btn .v-btn__content) {
  color: white !important;
}
</style>
