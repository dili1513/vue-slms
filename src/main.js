import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'

//css

// import 'normalize.css/normalize.css'
// import './styles/element-variables.scss'
// import '@/styles/index.scss' // global css

import {postKeyValueRequest} from "./api/api";
import {postRequest} from "./api/api";
import {putRequest} from "./api/api";
import {getRequest} from "./api/api";
import {deleteRequest} from "./api/api";

import {initMenu} from "./api/menu";

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false

Vue.use(ElementUI, {size: 'small'})

// 配置路由守卫
router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.path == '/') {
    next();
  } else {
    if (window.sessionStorage.getItem('account')){
      initMenu(router,store);
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
