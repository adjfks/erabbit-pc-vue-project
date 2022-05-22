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
