<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{ goods.categories[1].name }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{ goods.categories[0].name }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales :goods="goods" />
        </div>
        <div class="spec">
          <!-- 名字区组件 -->
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <XtxNumbox v-model="num" :max="goods.inventory" />
          <XtxButton type="primary" style="margin-top: 20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type="1" />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { provide, ref, watch } from 'vue'
import XtxNumbox from '../../components/library/xtx-numbox.vue'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    XtxNumbox,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup() {
    const goods = useGoods()

    // 更新sku
    const changeSku = (sku) => {
      if (sku.id) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }

    // 选择的商品数量
    const num = ref(1)

    // 向子孙提供goods数据
    provide('goods', goods)
    return { goods, num, changeSku }
  }
}

const useGoods = () => {
  const route = useRoute()
  const goods = ref(null)
  watch(
    () => route.params.id,
    async (newVal) => {
      if (route.path === `/product/${newVal}`) {
        const { result } = await findGoods(newVal)

        // 处理后台数据不规范，规格属性顺序与sku属性顺序不一致
        result.skus.forEach((sku) => {
          const sortSpecs = []
          result.specs.forEach((spec) => {
            sortSpecs.push(sku.specs.find((item) => item.name === spec.name))
          })
          sku.specs = sortSpecs
        })
        goods.value = result
        // 让商品数据为null让后使用v - if的组件可以重新销毁和创建
        // goods.value = null
        // nextTick(() => {
        //   goods.value = result
        // })
      }
    },
    { immediate: true }
  )
  return goods
}
</script>

<style lang="less" scoped>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
</style>
