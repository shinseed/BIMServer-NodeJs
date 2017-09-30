import axios from 'axios';
const apiUrl = 'http://localhost:3000/';

let options = {
    baseURL: apiUrl,
    timeout: 300000
}
let api = axios.create(options);
api.interceptors.request.use( (config)=> {    // 这里的config包含每次请求的内容
    if (localStorage.BIM) {
        config.headers['x-access-token'] = localStorage.BIM;
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});
api.interceptors.response.use((response)=>{
  return response;
},(error)=>{
  switch (error.response.status) {
    case 403:
    $nuxt.$router.push('/sign-in')
    $nuxt.$notify.error({
          title: `error status ${error.response.status}`,
          message: `${error.response.data.message}`
      });
      break;
    default:

  }

})
export default api;
