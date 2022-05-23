<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/">{{ topCategory.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px"></XtxCarousel>
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul v-if="topCategory.children && topCategory.children.length">
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
        <!-- 骨架屏 -->
        <ul v-else>
          <li v-for="i in 7" :key="i">
            <XtxSkeleton :width="'160px'" :height="'140px'"></XtxSkeleton>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
    </div>
  </div>
</template>

<script>
import { findBanner } from '@/api/home'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import XtxSkeleton from '@/components/library/xtx-skeleton.vue'
export default {
  name: 'TopCategory',
  setup() {
    const store = useStore()
    const route = useRoute()
    // 轮播图
    const sliders = ref([])
    findBanner().then((data) => {
      sliders.value = data.result
    })
    // 获取当前顶级分类
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find((item) => {
        // 通过路由参数获取当前顶级分类的id
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    return { sliders, topCategory }
  },
  components: { XtxSkeleton }
}
</script>

<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
