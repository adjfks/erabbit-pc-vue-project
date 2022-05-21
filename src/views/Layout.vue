<template>
  <!-- 顶部通栏导航 -->
  <AppTopNav />
  <!-- 头部 -->
  <AppHeader />
  <!-- 主体区域 -->
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <!-- 底部 -->
  <AppFooter />
</template>

<script>
import AppTopNav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
  name: 'xtx-layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter
  },
  setup() {}
}
</script>

<style lang="less" scoped></style>
