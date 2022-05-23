<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="categoryMsg.top" :to="`/category/${categoryMsg.top.id}`">{{ categoryMsg.top.name }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="categoryMsg.sub" :key="categoryMsg.sub.id">{{ categoryMsg.sub.name }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup() {
    const route = useRoute()
    const store = useStore()
    const categoryMsg = computed(() => {
      // 获得当前顶级路由
      const obj = {}
      store.state.category.list.forEach((top) => {
        top.children &&
          top.children.some((sub) => {
            if (sub.id === route.params.id) {
              obj.sub = { name: sub.name, id: sub.id }
              obj.top = { name: top.name, id: top.id }
              return true
            }
            return false
          })
      })
      return obj
    })

    return { categoryMsg }
  }
}
</script>

<style lang="less" scoped></style>
