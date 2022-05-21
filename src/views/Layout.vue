<template>
  <AppTopNav />
  <header>头部导航栏</header>
  <!-- 主体区域 -->
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <footer>底部</footer>
</template>

<script>
import AppTopNav from '@/components/app-topnav.vue'
export default {
  name: 'xtx-layout',
  components: {
    AppTopNav
  },
  setup() {}
}
</script>

<style lang="less" scoped></style>
