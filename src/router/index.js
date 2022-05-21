import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{ path: '/home', component: Home }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
