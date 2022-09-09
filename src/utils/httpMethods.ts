/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:52
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-07 10:05:18
 * @FilePath: /rod-asset-front/src/utils/httpMethods.ts
 * @Description:
 *
 */
export const httpMethodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
]

export const httpBodyTypeOptions = [
  { label: 'none', value: 'none' },
  { label: 'form-data', value: 'multipart/form-data' },
  {
    label: 'x-www-form-urlencoded',
    value: 'application/x-www-form-urlencoded',
  },
  { label: 'raw', value: 'application/json' },
]
