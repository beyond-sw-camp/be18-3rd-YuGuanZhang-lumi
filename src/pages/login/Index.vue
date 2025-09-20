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
            <div class="overlay-bg"></div>
            <div class="overlay-panel">
              <h1>Sign up</h1>
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
import LoginForm from './components/LoginForm.vue';
import SignupForm from './components/SignupForm.vue';
const isSignUpActive = ref(false);

function toggleForm() {
  isSignUpActive.value = !isSignUpActive.value;
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  background: none;
  z-index: 1;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/image.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.7; /* 투명도 조절 */
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

.form-card .v-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

  // 굳이 넣어야하는지 모르겠음
  .overlay-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/image.png'); /* 넣고 싶은 사진 */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.5; /* 사진 투명도 */
    z-index: -1; /* 내용물 뒤로 보내기 */
  }
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

.overlay-panel h1 {
  transform: translateY(-200px); /* 글자만 위로 올리기 */
}
</style>
