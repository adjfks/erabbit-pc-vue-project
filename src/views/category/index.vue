<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem to="/" :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
        </transition>
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
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <!-- 头部标题 -->
        <div class="head">
          <h3>- {{ item.name }} -</h3>
          <p class="tag">{{ item.desc }}</p>
          <XtxMore />
        </div>
        <!-- 主体商品 -->
        <div class="body">
          <CategoryGoods v-for="g in item.goods" :key="g.id" :goods="g" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findBanner } from '@/api/home'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import CategoryGoods from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: {
    CategoryGoods
  },
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

    // // 获取单个顶级分类的数据
    // const subList = ref([])
    // onBeforeRouteUpdate(async (to, from) => {
    //   // 仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
    //   if (to.params.id && from.params.id && to.params.id !== from.params.id) {
    //     findTopCategory(to.params.id).then((data) => {
    //       subList.value = data.result.children
    //     })
    //   }
    // })

    // 获取顶级分类展示商品的函数
    const getSubList = () => {
      findTopCategory(route.params.id).then((data) => {
        subList.value = data.result.children
      })
    }

    // 监听地址栏id
    const subList = ref([])
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && route.path === `/category/${newVal}`) getSubList()
      },
      {
        immediate: true
      }
    )

    return { sliders, topCategory, subList }
  }
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
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
