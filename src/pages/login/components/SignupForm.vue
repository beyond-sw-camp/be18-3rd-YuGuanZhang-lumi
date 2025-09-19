<template>
  <v-form style="max-width: 450px; margin: auto" @submit.prevent="submitClick">
    <v-text-field
      v-model="formData.name"
      label="이름을 입력해주세요."
      required
      style="width: 100%; height: 50px; margin-bottom: 12px"
      type="text"
      variant="outlined"
    />

    <v-row align="center" class="mt-2" no-gutters>
      <v-col cols="8">
        <v-text-field
          v-model="formData.email"
          label="이메일을 입력해주세요."
          required
          style="height: 50px"
          type="text"
          variant="outlined"
        />
      </v-col>

      <v-col class="d-flex" cols="4">
        <v-btn block color="#eeddff" style="height: 50px; margin-left: 8px" @click="sendEmail">
          인증 전송
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field
      v-model="formData.password"
      label="비밀번호를 입력해주세요."
      required
      style="width: 100%; height: 50px; margin-top: 12px; margin-bottom: 12px"
      type="password"
      variant="outlined"
    />

    <v-text-field
      v-model="formData.passwordConfirm"
      label="비밀번호 확인"
      required
      style="width: 100%; height: 50px; margin-bottom: 12px"
      type="password"
      variant="outlined"
    />

    <div
      v-if="formData.passwordConfirm"
      :style="{ color: passwordMatch ? 'green' : 'red', fontWeight: 'bold', marginBottom: '12px' }"
    >
      {{ passwordMatch ? '비밀번호 일치합니다.' : '비밀번호 불일치합니다.' }}
    </div>

    <v-checkbox
      v-model="formData.agree"
      label="개인정보 수집 및 이용에 동의합니다."
      required
      style="margin-bottom: 16px"
    />

    <v-row align="center" class="mt-2" justify="space-between">
      <v-btn color="#eeddff" style="height: 50px; width: 48%; font-weight: bold" @click="goBack">
        뒤로가기
      </v-btn>

      <v-btn color="#eeddff" style="height: 50px; width: 48%; font-weight: bold" @click="signUp">
        회원가입 완료
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup>
import axios from 'axios'
import { reactive, toRaw, computed } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agree: false,
})

const passwordMatch = computed(
  () =>
    formData.password && formData.passwordConfirm && formData.password === formData.passwordConfirm,
)

const emit = defineEmits(['switch-to-login'])

function goBack() {
  emit('switch-to-login')
}

async function sendEmail() {
  console.log('sendEmail 호출됨', formData.email)
  if (!formData.email) {
    alert('이메일을 입력해주세요.')
    return
  }
  try {
    const response = await axios.post('http://localhost:8080/api/email/send', {
      email: formData.email,
    })
    alert('이메일 인증 코드가 전송되었습니다.')
    console.log(response.data)
  } catch (error) {
    console.error(error)
    alert('이메일 전송에 실패했습니다.')
  }
}

async function signUp() {
  console.log('회원가입 호출', formData.name, formData.email, formData.password, formData.agree)
  if (!formData.name) {
    alert('이름을 입력해주세요.')
    return
  }
  if (!formData.email) {
    alert('이메일을 입력해주세요.')
    return
  }
  if (!formData.password) {
    alert('비밀번호를 입력해주세요.')
    return
  }
  if (!formData.agree) {
    alert('개인정보 및 이용 동의를 수락해주세요.')
    return
  }
  try {
    const response = await axios.post('http://localhost:8080/api/sign-up', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isPrivacyAgreement: formData.agree,
    })
    alert('회원가입 성공했습니다.')

    emit('switch-to-login')

    console.log(response.data)
  } catch (error) {
    console.error(error)
    alert('회원가입 실패했습니다.')
  }
}

function submitClick() {
  emit('form-submit', toRaw(formData))
}
</script>

<style lang="scss" scoped></style>
