import Vue from 'vue'
import VueRouter from "vue-router"
import Login from "../views/Login";
import Home from "../views/Home";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: "首页",
    component: Home,
    hidden: false
  }
]

const router = new VueRouter({
  routes
})

export default router
