<template>
  <div class="xtx-bread-item">
    <Router-link v-if="to" :to="to"><slot /></Router-link>
    <span v-else><slot /></span>
  </div>
</template>

<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object]
    }
  },
  setup() {}
}
</script>

<style lang="less" scoped></style>
