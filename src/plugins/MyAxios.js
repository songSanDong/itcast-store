import axios from 'axios';
const MyAxios = {};
// 插件必须提供一个install方
MyAxios.install = function (Vue) {
  // 配置全局的axios
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  Vue.prototype.$http = axios;
};
export default MyAxios;
