import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/update',
    name: 'Update',
    component: () => import('../views/Update.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
