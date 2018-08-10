// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/style.css';
import moment from 'moment';
import axios from 'axios';

Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});
// 配置全局的axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
Vue.prototype.$http = axios;
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
