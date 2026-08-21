import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('@/views/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('@/views/WeatherAboutView.vue')
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/FavoriteView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('@/views/WeatherDetailView.vue')
    },
    {
      path: '/mockup',
      name: 'WeatherMockup',
      component: () => import('@/components/exercise/WeatherMockup.vue')
    },
    {
      path: '/practice',
      name: 'Practice',
      component: () => import('@/components/practices/PracticeIndex.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
})

export default router
