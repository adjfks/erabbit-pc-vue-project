<template>
  <nav>顶部通栏</nav>
  <header>头部导航栏</header>
  <!-- 主体区域 -->
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <footer>底部</footer>
</template>

<script>
export default {
  name: 'xtx-layout',
  setup() {}
}
</script>

<style lang="less" scoped></style>
