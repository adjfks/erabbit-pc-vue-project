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

/**
 * 获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}
