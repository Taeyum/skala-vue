import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 뒤로 가기는 원래 보던 위치로, 새 페이지는 맨 위로
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('@/views/WeatherHomeView.vue'),
      // depth: nav 좌→우 순서. 페이지 전환 방향(좌우 슬라이드) 판정에 쓴다
      meta: { depth: 0 },
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('@/views/WeatherAboutView.vue'),
      meta: { depth: 3 },
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/FavoriteView.vue'),
      meta: { depth: 1 },
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('@/views/WeatherDetailView.vue'),
      meta: { depth: 1 },
    },
    {
      path: '/mockup',
      name: 'WeatherMockup',
      component: () => import('@/components/exercise/WeatherMockup.vue'),
      meta: { depth: 4 },
    },
    {
      path: '/practice',
      name: 'Practice',
      component: () => import('@/views/PracticeView.vue'),
      meta: { depth: 2 },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { depth: 99 },
    },
  ],
})

export default router
