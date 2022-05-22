<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- banner -->
        <HomeBanner />
        <!-- 新鲜好物panel -->
        <HomeNew />
        <!-- 人气推荐panel -->
        <HomeHot />
        <!-- 热门品牌 -->
        <HomeBrand />
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
export default {
  name: 'xtx-home-page',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand
  },
  setup() {}
}
</script>

<style lang="less" scoped></style>
