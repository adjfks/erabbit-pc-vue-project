<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- banner -->
        <HomeBanner />
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
export default {
  name: 'xtx-home-page',
  components: {
    HomeCategory,
    HomeBanner
  },
  setup() {}
}
</script>

<style lang="less" scoped></style>
