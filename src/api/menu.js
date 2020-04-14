import {getRequest} from "./api";


export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest('/system/config/menu').then(resp => {
    if (resp) {
      let fmtRoutes = formatRoutes(resp);
      router.addRoutes(fmtRoutes);
      store.commit('initRoutes', fmtRoutes);
    }
  })
}

export const formatRoutes = (routes) => {
  let ret = [];
  routes.forEach(route => {
    let {
      path,
      name,
      component,
      meta,
      children,
      iconCls
    } = route;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmtRoute = {
      path: path,
      name: name,
      meta: meta,
      children: children,
      iconCls: iconCls,
      component(resolve) {
        console.log(component);
        if (component.startsWith('Home')) {
          require(['../views/' + component + '.vue'], resolve);
        } else if (component.startsWith('Fau')) {
          require(['../views/fau/' + component + '.vue'], resolve);
        } else if (component.startsWith('Acc')) {
          require(['../views/account/' + component + '.vue'], resolve);
        } else if(component.startsWith('War')){
          require(['../views/warehouse/' + component + '.vue'], resolve);
        }
      }
    }
    ret.push(fmtRoute);
  })
  return ret;
}
