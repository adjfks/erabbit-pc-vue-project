import { createStore } from 'vuex'
// 导入vuex-persistedstate插件做数据持久化
import createPersistedstate from 'vuex-persistedstate'

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedstate({
      // 存储在localStorage中的键名
      key: 'erabbit-client-pc-store',
      // 要存储的模块：用户信息 购物车
      // 可以只存储模块下的部分数据，如 user.token
      paths: ['user', 'cart']
    })
  ]
})
