import Vue from 'vue';
import Router from 'vue-router';
// 导入message
import { Message } from 'element-ui';
const Login = () => import('../views/Login.vue');
const Home = () => import('../views/Home.vue');
const Users = () => import('../views/users/users.vue');
const Rights = () => import('../views/Rignt/rights.vue');
const Roles = () => import('../views/Rignt/Roles.vue');
const Categories = () => import('../views/goods/categories.vue');
const Goods = () => import('../views/goods/Goods.vue');
const GoodsAdd = () => import('../views/goods/GoodsAdd.vue');
const Params = () => import('../views/goods/Params.vue');
const Orders = () => import('../views/Orders/Orders.vue');
const Reports = () => import('../views/reports/reports.vue');

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
        { name: 'roles', path: '/roles', component: Roles },
        { name: 'categories', path: '/categories', component: Categories },
        { name: 'goods', path: '/goods', component: Goods },
        { name: 'goodsAdd', path: '/goods/add', component: GoodsAdd },
        { name: 'Params', path: '/Params', component: Params },
        { name: 'orders', path: '/orders', component: Orders },
        { name: 'reports', path: '/reports', component: Reports }
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
  if (to.name && to.name.toLocaleLowerCase() !== 'login') {
    // 判断 token
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 如果 token 不存在
      router.push('/login');
      Message.warning('请先登录');
      return;
    }
  }
  next();
});
export default router;
