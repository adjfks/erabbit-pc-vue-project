<template>
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" v-for="brand in filterData.brands" :key="brand.id" :class="{ active: filterData.selectedBrand === brand.id }" @click="changeBrand(brand.id)">{{ brand.name }}</a>
      </div>
    </div>
    <div class="item" v-for="p in filterData.saleProperties" :key="p.id">
      <div class="head">{{ p.name }}:</div>
      <div class="body">
        <a :class="{ active: p.selectedProp === attr.id }" href="javascript:;" v-for="attr in p.properties" :key="attr.id" @click="changeProps(attr.id, p.id)">{{ attr.name }}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script>
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'
export default {
  name: 'SubFilter',
  setup(props, { emit }) {
    const route = useRoute()
    // 获取筛选区数据
    const filterData = ref(null)
    // 标记筛选区是否正在加载
    const filterLoading = ref(false)
    watch(
      () => route.params.id,
      async (newVal) => {
        if (newVal && route.path === `/category/sub/${newVal}`) {
          filterLoading.value = true
          const { result } = await findSubCategoryFilter(route.params.id)
          // 记录选中的品牌
          result.selectedBrand = null
          result.brands.unshift({ id: null, name: '全部' })
          result.saleProperties.forEach((item) => {
            // 记录组属性中被选中的那个属性
            item.selectedProp = undefined
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterLoading.value = false
          filterData.value = result
        }
      },
      {
        immediate: true
      }
    )

    // 获取筛选查询参数对象
    const getFilterParams = () => {
      const filterParams = {}
      const attrs = []
      // 品牌id
      filterParams.brandId = filterData.value.selectedBrand
      // 属性数组
      filterData.value.saleProperties.forEach((p) => {
        const attr = p.properties.find((attr) => attr.id === p.selectedProp)
        if (attr && attr.id !== undefined) {
          attrs.push({ groupName: p.name, propertyName: attr.name })
        }
      })
      if (attrs.length) filterParams.attrs = attrs
      return filterParams
    }

    // 切换品牌
    const changeBrand = (id) => {
      if (filterData.value.brandId !== id) filterData.value.selectedBrand = id
      else return
      const filterParams = getFilterParams()
      // 通知父组件
      emit('filter-change', filterParams)
    }

    // 切换属性
    const changeProps = (attrid, pid) => {
      let update = false
      filterData.value.saleProperties.forEach((p) => {
        if (p.id === pid && p.selectedProp !== attrid) {
          p.selectedProp = attrid
          update = true
        }
      })
      if (update) {
        const filterParams = getFilterParams()
        // 通知父组件
        emit('filter-change', filterParams)
      }
    }

    return { filterData, filterLoading, changeBrand, changeProps }
  }
}
</script>

<style lang="less" scoped>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  padding: 10px 0;
}
</style>
