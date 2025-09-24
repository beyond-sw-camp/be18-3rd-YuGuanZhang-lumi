/**
 * router/index.js
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables

import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/pages/login';
import Signup from '@/pages/signup';

const routes = [
  { path: '/', redirect: '/channels' },
  { path: '/login', component: Login, meta: { layout: 'blank' } },
  { path: '/signup', component: Signup, meta: { layout: 'blank' } },
  { path: '/channels', component: () => import('@/pages/channel'), meta: { layout: 'root' } },
  { path: '/calendar', component: () => import('@/pages/calender'), meta: { layout: 'root' } },
  { path: '/chats', component: () => import('@/pages/chat'), meta: { layout: 'root' } },
  { path: '/setting', component: () => import('@/pages/setting'), meta: { layout: 'root' } },
  {
    path: '/channels/:channelId/classes',
    component: () => import('@/pages/class'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  },

  {
    path: '/channels/:channelId/assignments',
    component: () => import('@/pages/assignment/Index.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 과제 리스트 조회
  {
    path: '/channels/:channelId/assignments/new',
    component: () => import('@/pages/assignment/AssignmentCreate.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 등록
  {
    path: '/channels/:channelId/assignments/:assignmentId/edit',
    component: () => import('@/pages/assignment/AssignmentUpdate.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 수정
  {
    path: '/channels/:channelId/assignments/:assignmentId',
    component: () => import('@/pages/assignment/AssignmentDetail.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 과제 단일 조회
  {
    path: '/channels/:channelId/assignments/:assignmentId/submissions/:submissionId',
    component: () => import('@/pages/submission/Index.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 제출 단일 조회
  {
    path: '/channels/:channelId/assignments/:assignmentId/submissions/new',
    component: () => import('@/pages/submission/SubmissionCreate.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 제출 등록
  {
    path: '/channels/:channelId/assignments/:assignmentId/submissions/:submissionId/edit',
    component: () => import('@/pages/submission/SubmissionUpdate.vue'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  }, // 수정(학생)

  // { path: '/channels/:channelId/assignments/:assignmentId/submissions/new', component: Submission,  meta: { layout: 'root', subLayout: 'sublayout' }, }, 제출(학생)
  {
    path: '/channels/:channelId/materials',
    component: () => import('@/pages/material'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  },
  // { path: '/channels/:channelId/materials/new', component: ,meta: { layout: 'root', subLayout: 'sublayout' }, }, 등록
  // { path: '/channels/:channelId/materials/:materialId/edit', component: , meta: { layout: 'root', subLayout: 'sublayout' }, }, 수정
  // { path: '/channels/:channelId/materials/:materialId', component: , meta: { layout: 'root', subLayout: 'sublayout' }, }, 단일 조회
  {
    path: '/channels/:channelId/scores',
    component: () => import('@/pages/score'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  },
  {
    path: '/channels/:channelId/participants',
    component: () => import('@/pages/participant'),
    meta: { layout: 'root', subLayout: 'sublayout' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err);
    } else {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
