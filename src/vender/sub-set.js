/**
 * Find power-set of a set using BITWISE approach.
 * 使用位运算用于得到一个集合的所有非空子集
 * @param {*[]} originalSet
 * @return {*[][]}
 */
export default function getSubSet(originalSet) {
  // 存放最终结果
  const subSets = []
  // 传入集合的长度
  const originalSetLen = originalSet.length
  // 组合的数量
  const k = 2 ** originalSetLen

  // 使用位运算来获取子集,排除空集，从1开始
  for (let i = 1; i < k; i++) {
    // 用于收集当前子集合
    const path = []
    // 二进制数总共有originalSetLen位，每一位都来和1相与，若结果为1则选
    // 如 01001001 和 01000000 来判断第二位选不选 相与结果为1，选
    for (let j = 0; j < originalSetLen; j++) {
      if (i & (1 << j)) {
        path.push(originalSet[j])
      }
    }
    // 全部选完加入结果数组
    subSets.push(path)
  }

  // 返回最终结果
  return subSets
}
