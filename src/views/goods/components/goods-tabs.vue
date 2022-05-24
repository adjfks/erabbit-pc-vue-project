<template>
  <div class="goods-tab">
    <nav>
      <a href="javascript:;" :class="{ active: activeName === 'detail' }" @click="activeName = 'detail'">商品详情</a>
      <a href="javascript:;" :class="{ active: activeName === 'comment' }" @click="activeName = 'comment'"
        >商品评价<span>({{ goods.commentCount }}+)</span></a
      >
    </nav>
    <!-- 切换的内容区域 -->
    <component :is="'goods-' + activeName"></component>
  </div>
</template>

<script>
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
import { inject, ref } from 'vue'
export default {
  name: 'GoodsTabs',
  components: {
    GoodsDetail,
    GoodsComment
  },
  setup() {
    const activeName = ref('detail')

    // 接收商品数据
    const goods = inject('goods')

    return { activeName, goods }
  }
}
</script>

<style lang="less" scoped>
.goods-tab {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: '';
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
