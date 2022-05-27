// 购物车状态
// 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
// 线上：比上面多 isCollect 有用 discount 无用 两项项信息
// 导入获取最新商品信息的函数
import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      return state.list.filter((item) => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList(state) {
      return state.list.filter((item) => !(item.stock > 0 && item.isEffective))
    },
    // 选中的商品列表
    selectedList(state, getters) {
      return getters.validList.filter((item) => item.selected)
    },
    // 选中商品的件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((pre, cur) => pre + cur.count, 0)
    },
    // 选中商品的总金额
    selectedAmount(state, getters) {
      // 先乘100再除，防止小数
      return getters.selectedList.reduce((pre, cur) => pre + cur.count * cur.nowPrice * 100, 0) / 100
    },
    // 是否全选
    isCheckAll(state, getters) {
      return getters.selectedList.length === getters.validList.length && getters.selectedList.length !== 0
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
    },
    // 更新购物车商品
    updateCart(state, goods) {
      // goods字段可能不完整，goods有的字段才修改
      const updateGoods = state.list.find((item) => item.skuId === goods.skuId)
      for (const key in goods) {
        // 因为有属性值为false的key
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const delIndex = state.list.findIndex((item) => item.skuId === skuId)
      if (delIndex !== -1) {
        state.list.splice(delIndex, 1)
      }
    },
    // 设置购物车
    setCartList(state, list) {
      state.list = list
    }
  },
  // 都需要区分 登录 和 未登录 状态的操作
  actions: {
    insertCart(context, goods) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.profile.token) {
          // 已登录，TODO
          insertCart(goods)
            .then((data) => {
              return findCartList()
            })
            .then((data) => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('insertCart', goods)
          console.log('commit', goods)
          resolve()
        }
      })
    },
    // 更新列表信息，通过api获取购物车列表信息
    findCartList(context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录TODO
          findCartList().then((data) => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地获取,获取之前
          const promiseArr = context.state.list.map((item) => {
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr)
            .then((dataArr) => {
              dataArr.forEach((data, i) => {
                context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
              })
              resolve()
            })
            .catch((e) => {
              reject(e)
            })
        }
      })
    },
    // 删除
    deleteCart(context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录TODO
          deleteCart([skuId])
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 更新购物车信息
    updateCart(context, goods) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录TODO
          updateCart(goods)
            .then((data) => {
              return findCartList()
            })
            .then((data) => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('updateCart', goods)
          resolve()
        }
      })
    },
    // 全选
    checkAllCart(context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录TODO
          const ids = context.getters.validList.map((item) => item.skuId)
          checkAllCart({ selected, ids })
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          // 获取有效列表，遍历更新选中状态
          context.getters.validList.forEach((item) => {
            context.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart(context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 得到需要删除的商品列表（失效，选中）的skuId集合
          const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map((item) => item.skuId)
          deleteCart(ids)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          context.getters[isClear ? 'invalidList' : 'selectedList'].forEach((item) => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 更新购物车sku信息
    updateCartSku(context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          //
          const oldGoods = context.state.list.find((item) => item.skuId === oldSkuId)
          deleteCart([oldSkuId])
            .then(() => {
              return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
            })
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          const oldGoods = context.state.list.find((item) => item.skuId === oldSkuId)
          context.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          context.commit('insertCart', newGoods)
        }
      })
    },
    // 合并购物车
    async mergeLocalCart(context) {
      const artList = context.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(artList)
      // 清空本地购物车
      context.commit('setCartList', [])
    }
  }
}
