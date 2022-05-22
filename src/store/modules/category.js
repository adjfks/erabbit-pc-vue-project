// 导入常量分类数据
import { topCategory } from '@/api/constants'
// 导入请求顶级分类的api
import { findAllCategory } from '@/api/category'

// 分类模块
export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  // 修改state
  mutations: {
    setList(state, headCategory) {
      state.list = headCategory
    },
    // 显示
    open(state, topCateId) {
      const target = state.list.find((item) => item.id === topCateId)
      if (target !== -1) target.open = true
    },
    // 隐藏
    hide(state, topCateId) {
      const target = state.list.find((item) => item.id === topCateId)
      if (target !== -1) target.open = false
    }
  },
  // 异步操作
  actions: {
    // 获取列表数据并提交修改
    async getList({ commit }) {
      const { result } = await findAllCategory()
      // 每一项顶级分类增加open属性，控制子分类列表显示与隐藏
      result.forEach((item) => {
        item.open = false
      })
      commit('setList', result)
    }
  }
}
