<template>
  <div class="xtx-pagination" v-if="myTotal > 0">
    <a href="javascript:;" :class="{ disabled: myCurrentPage === 1 }" @click="changePage(myCurrentPage - 1)">上一页</a>
    <span v-if="pager.startPage > 1">...</span>
    <a href="javascript:;" :class="{ active: myCurrentPage === item }" v-for="(item, i) in pager.btnArr" :key="i" @click="changePage(item)">{{ item }}</a>
    <span v-if="pager.endPage < myTotal">...</span>
    <a href="javascript:;" :class="{ disabled: myCurrentPage === myTotal }" @click="changePage(myCurrentPage + 1)">下一页</a>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 总条目数
    total: {
      type: Number,
      default: 100
    },
    // 每页显示条目数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 按钮个数
    btnCount: {
      type: Number,
      default: 5
    }
  },
  setup(props, { emit }) {
    const myTotal = ref(100)
    const myPageSize = ref(10)
    const myCurrentPage = ref(1)
    const myBtnCount = ref(5)

    watch(
      props,
      () => {
        myTotal.value = props.total
        myPageSize.value = props.pageSize
        myCurrentPage.value = props.currentPage
        myBtnCount.value = props.btnCount
      },
      { immediate: true }
    )

    // 分页组件信息
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      let startPage = myCurrentPage.value - Math.floor(myBtnCount.value / 2)
      let endPage = startPage + myBtnCount.value - 1
      if (startPage < 1) {
        startPage = 1
        endPage = startPage + myBtnCount.value - 1 > myTotal.value ? myTotal.value : startPage + myBtnCount.value - 1
      }
      if (endPage > myTotal.value) {
        endPage = myTotal.value
        startPage = endPage - myBtnCount.value + 1 < 1 ? 1 : endPage - myBtnCount.value + 1
      }

      // 按钮数组
      const btnArr = []
      for (let i = startPage; i <= endPage; i++) {
        btnArr.push(i)
      }

      return { pageCount, startPage, endPage, btnArr }
    })

    // 切换页数
    const changePage = (page) => {
      if (page < 1 || page > myTotal.value) return
      myCurrentPage.value = page
      // 通知父组件
      emit('page-change', myCurrentPage.value)
    }

    return { pager, myCurrentPage, myTotal, myBtnCount, changePage }
  }
}
</script>

<style lang="less" scoped>
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
