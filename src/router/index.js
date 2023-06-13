import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      cache: true,
      meta: {
        cache: true
      },
      component: HomeView
    },
    {
      path: '/about',
      name: 'AboutView',
      meta: {
        cache: false
      },
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/setting',
      name: 'SettingView',
      meta: {
        cache: true
      },
      component: () => import('../views/SettingView.vue')
    }
  ]
});

export default router;
