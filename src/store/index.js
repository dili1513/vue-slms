import Vuex from 'vuex';
import Vue from 'vue';


Vue.use(Vuex)

export default new Vuex.Store({
  // 数据
  state: {
    routes: []
  },
  // 同步方法
  mutations: {
    initRoutes(state,data) {
      state.routes = data;
    }
  },
  // 异步方法
  actions: {

  }
})
