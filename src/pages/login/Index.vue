<template>
  <v-container class="login-page" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" md="8">
        <v-card class="card-container" elevation="10">
          <!-- 로그인 폼 -->
          <v-card class="form-card sign-in" :class="{ active: isSignUpActive }">
            <v-card-title class="justify-center">Sign In</v-card-title>
            <v-card-text>
              <LoginForm />
            </v-card-text>
          </v-card>

          <!-- 회원가입 폼 -->
          <v-card class="form-card sign-up" :class="{ active: isSignUpActive }">
            <v-card-title class="justify-center">회원가입</v-card-title>
            <v-card-text>
              <div style="margin-bottom: 12px; font-size: 12px; color: #555; text-align: center">
                서비스 이용을 위해 아래 정보를 입력해주세요.
              </div>
              <SignupForm @switch-to-login="isSignUpActive = false" />
            </v-card-text>
          </v-card>

          <!-- 오버레이 -->
          <div class="overlay" :class="{ 'right-active': isSignUpActive }">
            <div class="overlay-panel">
              <h1>회원가입</h1>
              <v-btn color="white" outlined @click="toggleForm">회원가입</v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import LoginForm from './login/components/LoginForm.vue';
import SignupForm from './login/components/SignupForm.vue';

const isSignUpActive = ref(false);

function toggleForm() {
  isSignUpActive.value = !isSignUpActive.value;
}
</script>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container {
  position: relative;
  width: 100%;
  min-height: 600px;
  overflow: hidden;
  background-color: #eeddff;
}

.form-card {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  transition: all 0.6s ease-in-out;
  background-color: #eeddff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

/* 로그인 카드 */
.form-card.sign-in {
  left: 0;
  z-index: 2;
}

/* 회원가입 카드 (기본 숨김) */
.form-card.sign-up {
  left: 0;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
}

/* 로그인 → 회원가입 슬라이드 */
.form-card.active.sign-in {
  transform: translateX(100%);
}

/* 회원가입 활성화 */
.form-card.active.sign-up {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  pointer-events: auto;
}

/* 오버레이 */
.overlay {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  background-color: #eeddff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay.right-active {
  transform: translateX(-100%);
}

.overlay-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}
</style>
