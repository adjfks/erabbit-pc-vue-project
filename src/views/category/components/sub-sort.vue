<template>
  <div class="sub-sort">
    <!-- 第一行左边 -->
    <div class="sort">
      <a href="javascript:;" :class="{ active: sortParams.sortField === null }" @click="changeSortField(null)">默认排序</a>
      <a href="javascript:;" :class="{ active: sortParams.sortField === 'publishTime' }" @click="changeSortField('publishTime')">最新商品</a>
      <a href="javascript:;" :class="{ active: sortParams.sortField === 'orderNum' }" @click="changeSortField('orderNum')">最高人气</a>
      <a href="javascript:;" :class="{ active: sortParams.sortField === 'evaluateNum' }" @click="changeSortField('evaluateNum')">评论最多</a>
      <a href="javascript:;" :class="{ active: sortParams.sortField === 'price' }" @click="changeSortField('price')">
        价格排序
        <i class="arrow up" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod === 'asc' }" />
        <i class="arrow down" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod === 'desc' }" />
      </a>
    </div>
    <!-- 第一行右边 -->
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory" @click="changeChecked()">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount" @click="changeChecked()">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup(props, { emit }) {
    const sortParams = reactive({
      // 是否有货
      inventory: false,
      // 只显示特惠
      onlyDiscount: false,
      // 分类依据的字符串：publishTime,orderNum,price,evaluateNum
      sortField: null,
      // 排序规则：asc为正序，desc为倒序，默认为desc
      sortMethod: null
    })

    // 改变排序依据
    const changeSortField = (sortField) => {
      let update = false
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) return (sortParams.sortMethod = 'desc')
        sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        update = true
      } else {
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
        update = true
      }
      if (update) emit('sort-change', sortParams)
    }

    const changeChecked = () => {
      emit('sort-change', sortParams)
    }

    return { sortParams, changeSortField, changeChecked }
  }
}
</script>

<style lang="less" scoped>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
