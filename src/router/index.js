import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
//配置路由规则
Vue.use(Router)

export default new Router({
  routes: [
    { name: 'Home', path: '/', component: Home },
    { name: 'Login', path: '/login', component: Login }
  ]
});
