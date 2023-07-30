import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/post/:id', // :id 代表动态路由, 通过 this.$route.params.id 获取
    name: 'post',
    component: () => import('../views/Post.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

