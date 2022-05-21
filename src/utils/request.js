import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 使用拦截器，默认请求时携带token
instance.interceptors.request.use(
  (config) => {
    const { profile } = store.state.user
    if (profile.token) config.headers.Authorization = `Bearer ${profile.token}`
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response && err.response.status === 401) {
      // 清空本地用户信息 token
      store.commit('user/setUser', {})
      // 获得当前页面地址，如'/home'
      const fullPath = encodeURIComponent(router.currentRoute.fullPath)
      // 跳转到登录页面，通过路由参数存储当前页面地址
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

/**
 *请求接口
 *@param {String} url 请求地址
 *@param {String} url 请求方法
 *@param {String} url 提交数据
 *@returns
 */
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // get 使用 params
    // post 使用 data
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
