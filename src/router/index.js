import Vue from "vue";
import VueRouter from 'vue-router'

// 懒加载
const Home = () => import('../views/home/Home.vue')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')

// 1.安装插件
Vue.use(VueRouter)

// 2.创建路由
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: "首页",
    component: Home
  },
  {
    path: '/category',
    name: '/category',
    component:Category
  },
  {
    path: '/cart',
    name: '/cart',
    component: Cart
  },
  {
    path: '/profile',
    name: '/profile',
    component: Profile
  },
  {
    path: '/detail/:iid',
    component:Detail
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

// 3.导出
export default router
