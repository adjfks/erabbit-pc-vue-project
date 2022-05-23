<template>
  <div class="goods-image">
    <!-- 大图片容器 -->
    <div class="large" :style="[{ backgroundImage: `url(${images[currIndex]})` }, bgPosition]" v-if="!isOutside"></div>
    <!-- 主图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!-- 遮罩 -->
      <div class="layer" ref="layer" v-show="!isOutside" :style="position"></div>
    </div>
    <!-- 小图片 -->
    <ul class="small">
      <li v-for="(img, idx) in images" :key="img" :class="{ active: idx === currIndex }">
        <img :src="img" alt="" @mouseenter="currIndex = idx" />
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch, reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const currIndex = ref(0)
    const { target, isOutside, position, bgPosition } = useImgPreview()
    return { currIndex, target, isOutside, position, bgPosition }
  }
}

const useImgPreview = () => {
  const target = ref(null)
  const { elementX, elementY, isOutside } = useMouseInElement(target)
  // 遮罩定位
  const position = reactive({ left: 0, top: 0 })
  // 背景定位
  const bgPosition = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })

  watch([elementX, elementY, isOutside], () => {
    // 边界判断
    if (elementX.value < 100) position.left = 0
    else if (elementX.value > 300) position.left = 200
    else position.left = elementX.value - 100
    if (elementY.value < 100) position.top = 0
    else if (elementY.value > 300) position.top = 200
    else position.top = elementY.value - 100

    bgPosition.backgroundPositionX = -position.left * 2 + 'px'
    bgPosition.backgroundPositionY = -position.top * 2 + 'px'
    position.left = position.left + 'px'
    position.top = position.top + 'px'
  })

  return { target, isOutside, position, bgPosition }
}
</script>

<style lang="less" scoped>
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
