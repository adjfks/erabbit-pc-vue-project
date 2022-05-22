<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li v-for="topCate in topCategoryList" :key="topCate.id" @mouseenter="showSubList(topCate.id)" @mouseleave="hideSubList(topCate.id)">
      <Router-link :to="`/category/${topCate.id}`" @click="hideSubList(topCate.id)">{{ topCate.name }}</Router-link>
      <!-- layer -->
      <div class="layer" :class="{ open: topCate.open }">
        <ul>
          <li v-for="subCate in topCate.children" :key="subCate.id">
            <Router-link :to="`/category/sub/${subCate.id}`" @click="hideSubList(topCate.id)">
              <img :src="subCate.picture" alt="" />
              <p>{{ subCate.name }}</p>
            </Router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  setup() {
    const store = useStore()
    // 使用计算属性动态获取顶级分类列表
    const topCategoryList = computed(() => {
      return store.state.category.list
    })
    // 控制二级分类列表的显示与隐藏
    const showSubList = (id) => {
      store.commit('category/open', id)
    }
    const hideSubList = (id) => {
      store.commit('category/hide', id)
    }
    return { topCategoryList, showSubList, hideSubList }
  }
}
</script>

<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
  }
}
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
  &.open {
    height: 132px;
    opacity: 1;
  }
}
</style>
