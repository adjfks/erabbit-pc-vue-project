// 购物车状态
// 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
// 线上：比上面多 isCollect 有用 discount 无用 两项项信息
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  mutations: {
    // 添加购物车
    insertCart(state, goods) {
      // 首先判断本地是否已经添加过相同的商品
      const sameIndex = state.list.findIndex((item) => item.skuId === goods.skuId)
      if (sameIndex >= 0) {
        // 有添加过，数量累加
        goods.count = state.list[sameIndex].count + goods.count
        // 删除旧数据
        state.list.splice(sameIndex, 1)
      }
      // 加入购物车
      state.list.unshift(goods)
    }
  },
  actions: {
    insertCart(context, goods) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.token) {
          // 已登录，TODO
        } else {
          // 未登录
          context.commit('insertCart', goods)
          resolve()
        }
      })
    }
  }
}
