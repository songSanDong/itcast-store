// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
// 引入路由
import router from './router';
// 引入布局组件
import ElementUI from 'element-ui';
// 全局样式
import 'element-ui/lib/theme-chalk/index.css';
// 全局样式
import './assets/css/style.css';
// 处理时间戳
import moment from 'moment';
// 引入 axios 发送异步请求
import axios from 'axios';
// 注册 vue 插件
import myaxios from './plugins/MyAxios.js';

Vue.config.productionTip = false;
// 注册插件
Vue.use(ElementUI);
/* eslint-disable no-new */
// 注册地址, 全局 axios 插件
Vue.use(myaxios);
// 时间戳处理
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
