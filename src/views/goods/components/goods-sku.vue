<template>
  <div class="goods-sku">
    <!-- 属性1 -->
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img @click="clickSpecs(item, val)" v-if="val.picture" :class="{ selected: val.selected, disabled: val.disabled }" :src="val.picture" alt="" :title="val.name" />
          <span @click="clickSpecs(item, val)" :class="{ selected: val.selected, disabled: val.disabled }" v-else>{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import getSubSet from '@/vender/sub-set.js'
const spliter = '★'
/**
 *获取可行路径字典
 *@param {Array} skus sku数组
 *@returns {Object}
 */
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach((sku) => {
    // 过滤无效库存
    if (sku.inventory) {
      // 当前sku的valueName数组
      const valArr = sku.specs.map((spec) => spec.valueName)
      // 获取sku的子集
      const subSet = getSubSet(valArr)
      // 将 子集项 - sku id 加入路径字典
      subSet.forEach((sub) => {
        // 得到键名
        const key = sub.join(spliter)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })

  return pathMap
}
/**
 *获取当前选中的规格集合
 *@param {Array} 一个商品属性数组
 *@returns {Array} 规格的集合
 */
const getSelectSpecVal = (specs) => {
  const result = []
  specs.forEach((spec) => {
    const match = spec.values.find((item) => item.selected)
    // 不要过滤无效值，因为后面要一一对应
    result.push(match ? match.name : undefined)
  })
  return result
}
/**
 *更新禁用按钮状态
 *@param {Array} 所有属性的数组
 *@param {Object} 可行路径数组
 *@returns
 */
const updateDisabledStatus = (specs, pathMap) => {
  // 获取当前选中规格数组
  const selectedArr = getSelectSpecVal(specs)
  // 遍历所有按钮，加入选中规格数组对应位置生成新数组
  specs.forEach((spec, idx) => {
    // 拷贝一份当前选中数组
    const temp = selectedArr.slice(0)
    spec.values.forEach((val) => {
      // 选中的值直接忽略
      if (val.selected) return
      // 替换数组对应位置的值
      temp[idx] = val.name
      // 过滤无效值生成key
      const key = temp.filter((v) => v).join(spliter)
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}
/**
 *初始化选中状态
 *@param {Object} goods
 *@param {String} skuId
 *@returns
 */
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find((sku) => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach((val) => {
        val.selected = val.name === value
      })
    })
  }
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: {}, skus: {} })
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化时更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 根据传入的skuId初始化选中状态
    initSelectedStatus(props.goods, props.skuId)
    const clickSpecs = (item, val) => {
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach((bv) => {
          bv.selected = false
        })
        val.selected = true
      }
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将数据传给父组件
      const selectedArr = getSelectSpecVal(props.goods.specs).filter((v) => v)
      // 判断规格信息有没有选完整
      if (selectedArr.length === props.goods.specs.length) {
        const skuIds = pathMap[selectedArr.join(spliter)]
        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 得到 属性名：属性值
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}；${n.valueName}`, '')
        })
      } else {
        emit('change', {})
      }
    }

    return { clickSpecs }
  }
}
</script>

<style lang="less" scoped>
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  // 选中
  &.selected {
    border-color: @xtxColor;
  }
  // 禁用
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
