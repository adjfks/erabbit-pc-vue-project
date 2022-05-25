// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
// 默认显示图片
// 使用webpack提供的require.context实现批量注册组件
// 1. 路径 2. 是否加载子目录 3.匹配的正则表达式
import defaultImg from '@/assets/images/200.png'
import Message from './Message'
const importFn = require.context('./', false, /\.vue$/)

// 自定义指令：实现图片懒加载
const defineDirective = (app) => {
  app.directive('lazyload', {
    mounted(el, binding) {
      // 创建观察者
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          // 进入可视区
          if (isIntersecting) {
            // 停止观察该元素
            observer.unobserve(el)
            el.onerror = () => (el.src = defaultImg)
            el.src = binding.value
          }
        },
        { threshold: 0.01 }
      )
      observer.observe(el)
    }
  })
}
export default {
  // 在app上进行扩展，app提供 component directive 函数
  // 如果要挂载原型 app.config.globalProperties 方式
  install(app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    importFn.keys().forEach((key) => {
      const component = importFn(key).default
      app.component(component.name, component)
    })
    defineDirective(app)
    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message // 原型函数
  }
}
