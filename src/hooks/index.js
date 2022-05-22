// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 要观察的对象
  const target = ref(null)
  // 数据结构数组
  const result = ref([])
  const { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
    // isIntersecting 是否进入可视区域，true是进入 false是移出
    // observerElement 被观察的dom
    if (isIntersecting) {
      stop()
      // 进入可是区域，调用api获取数据
      apiFn().then((data) => {
        result.value = data.result
      })
    }
  })
  // 返回--->数据（dom,后台数据）
  return { target, result }
}
