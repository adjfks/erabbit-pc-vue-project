<script>
import { computed, provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup(props, { emit }) {
    // 双向数据绑定
    const activeName = computed({
      get() {
        return props.modelValue
      },
      set(newVal) {
        emit('update:modelValue', newVal)
      }
    })

    // 注入到孙组件
    provide('activeName', activeName)

    // 点击选项卡切换
    const tabClick = (name, idx) => {
      activeName.value = name
      emit('tab-click', { name, idx })
    }

    return { activeName, tabClick }
  },
  render() {
    const items = this.$slots.default()

    const dynamicPanels = []
    items.forEach((item, idx) => {
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        item.children.forEach((child, idx) => {
          dynamicPanels.push(child)
        })
      }
    })

    const nav = (
      <nav>
        {dynamicPanels.map((panel, idx) => {
          return (
            <a
              href="javascript:;"
              class={{ active: this.activeName === panel.props.name }}
              onClick={() => this.tabClick(panel.props.name, idx)}
            >
              {panel.props.label}
            </a>
          )
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>
<style lang="less" scoped>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
