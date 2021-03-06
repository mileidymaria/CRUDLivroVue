/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import LivroCrud from '../components/LivroCrud'
import EditoraCrud from '../components/EditoraCrud'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/livros',
    component: LivroCrud 
  },
  {
    path: '/editoras',
    component: EditoraCrud 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router