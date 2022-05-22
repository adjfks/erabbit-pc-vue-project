import request from '@/utils/request'

/**
 *获取品牌数据
 *@param {Number} limit
 *@returns
 */
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 *新鲜好物接口
 *@param {}
 *@returns
 */
export const findNew = () => {
  return request('home/new', 'get')
}
