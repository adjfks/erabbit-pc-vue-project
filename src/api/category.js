// 导入请求函数
import request from '@/utils/request'

/**
 *获取首页头部分类数据
 *@param {}
 *@returns
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
