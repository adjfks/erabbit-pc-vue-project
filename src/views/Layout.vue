<template>
  <!-- 顶部通栏导航 -->
  <AppTopNav />
  <!-- 头部 -->
  <AppHeader />
  <!-- 吸顶头部 -->
  <AppHeaderSticky />
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
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'xtx-layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup() {
    const store = useStore()
    // 触发actions分类获取数据
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
main {
  height: 1000px;
}
</style>
