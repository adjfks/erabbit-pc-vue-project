<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="changeFilter(filterParams)" />
      <!-- 结果区 -->
      <div class="goods-list">
        <!-- 排序选区 -->
        <SubSort @sort-change="changeSort(sortParams)" />
        <!-- 商品列表 -->
        <ul>
          <li v-for="g in goodsList" :key="g.id">
            <GoodsItem :goods="g" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '@/api/category'
import XtxInfiniteLoading from '@/components/library/xtx-infinite-loading.vue'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem,
    XtxInfiniteLoading
  },
  setup() {
    // 路由
    const route = useRoute()
    // 定义商品数据列表
    const goodsList = ref([])
    // 请求参数对象
    let goodsParams = {
      // 第几页
      page: 1,
      // 一页多少
      pageSize: 20,
      // 二级分类id
      id: null
    }
    // 控制无限加载组件
    const loading = ref(false)
    const finished = ref(false)

    // 发起请求获取数据的函数
    const getData = async () => {
      loading.value = true
      const { result } = await findSubCategoryGoods(goodsParams)
      goodsList.value.push(...result.items)
      // 页数加一
      if (++goodsParams.page === result.pages) finished.value = true
      loading.value = false
    }

    // 监听路由切换时重新获取商品数据列表
    watch(
      () => route.params.id,
      (newVal) => {
        if (route.path === `/category/sub/${newVal}`) {
          // 更新二级分类id
          goodsParams.id = newVal
          // 重置页数和商品列表
          goodsParams.page = 1
          goodsList.value = []
          // 发起请求获取数据
          getData()
        }
      },
      { immediate: true }
    )

    // 筛选区改变
    const changeFilter = (filterParams) => {
      goodsParams = { ...goodsParams, ...filterParams }
      goodsParams.page = 1
      goodsList.value = []
      getData()
    }

    // 排序区改变
    const changeSort = (sortParams) => {
      goodsParams = { ...goodsParams, ...sortParams }
      goodsParams.page = 1
      goodsList.value = []
      getData()
    }
    return { goodsList, loading, finished, changeFilter, getData, changeSort }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
