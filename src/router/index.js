import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Users from '../views/users/users.vue';
// 配置路由规则
Vue.use(Router);

export default new Router({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    {
      name: 'Home',
      path: '/',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users }
      ]
    }
  ]
});
