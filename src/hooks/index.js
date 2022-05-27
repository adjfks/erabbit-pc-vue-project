// 提供复用逻辑的函数（钩子）
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'

// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 要观察的对象
  const target = ref(null)
  // 数据结构数组
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是否进入可视区域，true是进入 false是移出
      // observerElement 被观察的dom
      if (isIntersecting) {
        stop()
        // 进入可是区域，调用api获取数据
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    },
    {
      // threshold 容器和可视区交叉的占比（进入的面积/容器完整面试） 取值，0-1 之间，
      // 默认比0大，所以需要滚动较多才能触发进入可视区域事件。
      threshold: 0
    }
  )
  // 返回--->数据（dom,后台数据）
  return { target, result }
}

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    },
    1000,
    false
  )
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
