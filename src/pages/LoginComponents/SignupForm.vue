<template>
  <v-form @submit.prevent="submitClick" style="max-width: 450px; margin: auto">
    <v-text-field
      v-model="formData.name"
      label="이름을 입력해주세요."
      required
      type="text"
      variant="outlined"
      style="width: 100%; height: 50px; margin-bottom: 12px"
    />

    <v-row class="mt-2" align="center" no-gutters>
      <v-col cols="8">
        <v-text-field
          v-model="formData.inEamil"
          label="이메일을 입력해주세요."
          required
          type="text"
          variant="outlined"
          style="height: 50px"
        />
      </v-col>

      <v-col cols="4" class="d-flex">
        <v-btn block color="#eeddff" style="height: 50px; margin-left: 8px" @click="submitClick">
          인증 전송
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field
      v-model="formData.password"
      label="비밀번호를 입력해주세요."
      required
      type="password"
      variant="outlined"
      style="width: 100%; height: 50px; margin-top: 12px; margin-bottom: 12px"
    />

    <v-text-field
      v-model="formData.passwordConfirm"
      label="비밀번호 확인"
      required
      type="password"
      variant="outlined"
      style="width: 100%; height: 50px; margin-bottom: 12px"
    />

    <v-checkbox
      v-model="formData.agree"
      label="개인정보 수집 및 이용에 동의합니다."
      style="margin-bottom: 16px"
      required
    />

    <v-row class="mt-2" align="center" justify="space-between">
      <v-btn color="#eeddff" style="height: 50px; width: 48%; font-weight: bold" @click="goBack">
        뒤로가기
      </v-btn>

      <v-btn
        color="#eeddff"
        style="height: 50px; width: 48%; font-weight: bold"
        @click="submitClick"
      >
        회원가입 완료
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup>
import { reactive, toRaw } from 'vue'

const formData = reactive({
  name: '',
  inEamil: '',
  password: '',
  passwordConfirm: '',
  agree: false,
})

const emit = defineEmits(['form-submit'])

const goBack = () => {
  window.history.back()
}

const submitClick = () => {
  emit('form-submit', toRaw(formData))
}
</script>

<style lang="scss" scoped></style>
