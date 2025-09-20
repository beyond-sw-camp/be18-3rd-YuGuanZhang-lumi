<template>
  <div class="control">
    <v-form class="control" @submit.prevent="submitClick">
      <v-text-field
        v-model="formData.email"
        label="Email"
        required
        style="width: 400px; height: 60px"
        type="text"
        variant="outlined"
      />
      <v-text-field
        v-model="formData.password"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        label="Password"
        required
        style="width: 400px; height: 60px"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        @click:append-inner="togglePassword"
      />
      <v-btn block color="deep-purple" type="submit" @click="login">로그인</v-btn>
    </v-form>
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = reactive({
  email: '',
  password: '',
});

const emit = defineEmits(['form-submit']);

async function login() {
  if (!formData.email) return alert('이메일을 입력해주세요.');
  if (!formData.password) return alert('비밀번호를 입력해주세요.');

  try {
    const response = await axios.post('http://localhost:8080/api/login', {
      email: formData.email,
      password: formData.password,
    });

    console.log('API 응답 전체:', response.data);

    localStorage.removeItem('refreshToken');

    const loginData = response.data.data[0];
    localStorage.setItem('refreshToken', loginData.refreshToken);

    router.push('/channels');
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert('로그인에 실패했습니다.');
    }
  }
}

const showPassword = ref(false);
function togglePassword() {
  showPassword.value = !showPassword.value;
}

function submitClick() {
  emit('form-submit', toRaw(formData));
}
</script>

<style scoped>
.control {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}
</style>
