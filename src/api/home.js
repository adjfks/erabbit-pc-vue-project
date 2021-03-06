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

/**
 *人气推荐
 *@param {}
 *@returns
 */
export const findHot = () => {
  return request('home/hot', 'get')
}

/**
 *商品区块数据
 *@param {}
 *@returns
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}

/**
 *最新专题
 *@param {}
 *@returns
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
