import axios from 'axios';
const MyAxios = {};
// 插件必须提供一个install方
MyAxios.install = function (Vue) {
  // 配置全局的axios
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  Vue.prototype.$http = axios;
  // Add a request interceptor
  // 在axios官网有说明, interceptors 请求拦截器
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (config.url.toLocaleLowerCase !== 'login') {
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
};
export default MyAxios;
