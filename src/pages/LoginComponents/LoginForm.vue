<template>
  <v-form @submit.prevent="submitClick">
    <v-text-field
      v-model="formData.email"
      label="Email"
      required
      type="text"
      variant="outlined"
      style="width: 400px; height: 60px"
    />
    <v-text-field
      v-model="formData.password"
      label="Password"
      required
      :type="showPassword ? 'text' : 'password'"
      variant="outlined"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="togglePassword"
      style="width: 400px; height: 60px"
    />
    <v-btn block color="deep-purple " type="submit">로그인</v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive, toRaw } from 'vue'

const formData = reactive({
  email: '',
  password: '',
})

const emit = defineEmits(['form-submit'])

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const submitClick = () => {
  emit('form-submit', toRaw(formData))
}
</script>
