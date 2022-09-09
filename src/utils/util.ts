/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:52
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-06 19:13:19
 * @FilePath: /rod-asset-front/src/utils/util.ts
 * @Description:
 *
 */
/**
 * 树形数据转换
 * @param {*} data
 * @param {*} parentId
 */
export function treeDataTranslate(data: any[], parentId = null): any[] {
  return data
    .filter((item) => item.parentId === parentId)
    .map((v) => {
      return {
        ...v,
        children: treeDataTranslate(data, v.id),
      }
    })
}

const defaultInitializer = (index: number) => index

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index))
}

export function updateQueryStringParameter(uri: string, key: string, value: string) {
  if (!value) {
    return uri
  }
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2')
  } else {
    return uri + separator + key + '=' + value
  }
}
