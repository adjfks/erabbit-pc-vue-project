<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggloeDialog" :class="{ active: active }">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
          @click="changeCurrList(item)"
          >{{ item.name }}</span
        >
      </template>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      defulat: '请选择配送地址'
    }
  },
  setup(props, { emit }) {
    // 控制展开关闭
    const active = ref(false)
    // 存放城市数据
    const cityData = ref([])
    // 标记是否正在加载
    const loading = ref(false)
    // 当前展示的列表
    const currList = ref([])
    // 用户选择的地址信息，这是需要发送到后台的参数
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 展开函数
    const openDialog = () => {
      loading.value = true
      active.value = true
      getCityData().then((data) => {
        cityData.value = data
        loading.value = false
        // 每次打开弹层先展示所有身份的列表
        currList.value = cityData.value
      })
      // 清空之前的选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    // 关闭弹层
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开和关闭
    const toggloeDialog = () => {
      if (!active.value) openDialog()
      else closeDialog()
    }

    const target = ref(null)
    onClickOutside(target, () => {
      active.value = false
    })

    // 点击省份或城市切换列表
    const changeCurrList = (item) => {
      // 判断点击的是城市、省份还是区
      switch (item.level) {
        case 0: {
          changeResult.provinceCode = item.code
          changeResult.provinceName = item.name
          break
        }
        case 1: {
          changeResult.cityCode = item.code
          changeResult.cityName = item.name
          break
        }
        case 2: {
          changeResult.countyCode = item.code
          changeResult.countyName = item.name
          break
        }
      }
      // 判断是否还有子级，有则继续显示
      if (item.areaList && item.areaList.length) {
        currList.value = item.areaList
      } else {
        // 没有子级，点击后填写上该地址
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName}`
        changeResult.fullLocation += item.level > 1 ? ` ${changeResult.countyName}` : ''
        console.log(changeResult.fullLocation)
        // 关闭弹层
        closeDialog()
        // 将数据通知给父组件
        emit('change', changeResult)
      }
    }

    return { active, target, loading, currList, toggloeDialog, changeCurrList }
  }
}

// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  // 这个位置可能有异常操作，封装成promise
  return new Promise((resolve, reject) => {
    if (window.cityData) resolve(window.cityData)
    else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then((res) => {
        window.cityData = res.data
        console.log(window.cityData)
        resolve(window.cityData)
      })
    }
  })
}
</script>

<style lang="less" scoped>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
