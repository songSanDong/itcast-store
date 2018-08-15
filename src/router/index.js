import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Users from '../views/users/users.vue';
import Rights from '../views/Rignt/rights.vue';
import Roles from '../views/Rignt/Roles.vue';
// 导入message
import { Message } from 'element-ui';
// 配置路由规则
Vue.use(Router);
const router = new Router({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    {
      name: 'Home',
      path: '/',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users },
        { name: 'rights', path: '/rights', component: Rights },
        { name: 'roles', path: '/roles', component: Roles }
      ]
    }
  ]
});
// 路由的全局前置守卫 （拦截器）  -- 路由跳转之前执行
router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // next();
  // 如果是登录的时候不判断token ，不是登录才判断token
  // console.log(to);
  if(to.name && to.name.toLocaleLowerCase() !== 'login') {
    // 判断 token
    const token = sessionStorage.getItem('token');
    if(!token) {
      // 如果 token 不存在
      router.push('/login');
      Message.warning('请先登录');
      return;
    }
  }
  next();
});
export default router;
