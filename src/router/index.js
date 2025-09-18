/**
 * router/index.js
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'

// import Layout from '@/layouts/Layout';
import Login from '@/pages/login.vue'
import Signup from '@/pages/signup'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  // { path: '/channels', component: () => import('@/pages/channel') },
  // { path: '/calender', component: () => import('@/pages/calender') },
  // { path: '/chat', component: () => import('@/pages/chat') },
  // { path: '/setting', component: () => import('@/pages/setting') },
  // { path: '/channels/:channelId/classes', component: () => import('@/pages/class') },
  // { path: '/channels/:channelId/assignments', component: () => import('@/pages/assignment') },
  // { path: '/channels/:channelId/assignments/new', component:  }, 등록
  // { path: '/channels/:channelId/assignments/:assignmentId/edit', component:  }, 수정
  // { path: '/channels/:channelId/assignment/:assignmentId', component: }, 단일 조회
  // { path: '/channels/:channelId/assignments/:assignmentId/submissions/new', component:  }, 등록
  // { path: '/channels/:channelId/assignments/:assignmentId/submissions/:submissionId/edit', component:  }, 수정(학생)
  // { path: '/channels/:channelId/assignments/:assignmentId/submissions/new', component: Submission }, 제출(학생)
  // { path: '/channels/:channelId/materials', component: () => import('@/pages/material') },
  // { path: '/channels/:channelId/materials/new', component:  }, 등록
  // { path: '/channels/:channelId/materials/:materialId/edit', component:  }, 수정
  // { path: '/channels/:channelId/materials/:materialId', component:  }, 단일 조회
  // { path: '/channels/:channelId/participants', component: () => import('@/pages/participant') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
