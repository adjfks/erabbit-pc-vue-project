<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render() {
    // 获取默认插槽中的内容,得到的是一个数组
    const items = this.$slots.default()
    // 定义一个数组，用来作为h函数的第三个参数，即包含当前Bread组件所有子节点的数组
    const children = []
    // 遍历数组
    items.forEach((item, idx) => {
      // 将每一项加入数组中
      children.push(item)
      // 当前项不是最后一项就在它后面加一个分隔符，分隔符使用h函数创建
      idx !== items.length - 1 && children.push(h('i', { class: 'iconfont icon-angle-right' }))
    })
    // render函数返回当前组件渲染内容
    return h('div', { class: 'xtx-bread' }, children)
  },
  setup() {}
}
</script>

<style lang="less">
// 去除 scoped 属性，目的：然样式作用到xtx-bread-item组件
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  // ul li:last-child {}
  // 先找到父元素，找到所有的子元素，找到最后一个，判断是不是LI，是就是选中，不是就是无效选择器
  // ul li:last-of-type {}
  // 先找到父元素，找到所有的类型为li的元素，选中最后一个
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式的方式，不合理
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>
