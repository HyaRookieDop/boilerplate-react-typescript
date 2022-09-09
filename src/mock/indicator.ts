/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 14:41:07
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-05 16:10:18
 * @FilePath: /rod-asset-front/src/mock/indicator.ts
 * @Description:
 *
 */
import Mock, { Random } from 'mockjs'

import setupMock from './setupMock'

const MetricsList = [
  {
    id: '2',
    namespace: 'test',
    indicatorName: '人民币参考汇率:保加利亚',
    shortName: '参考汇率:CNY/BGN',
    belongLabel: '汇率@人民币汇率@人民币参考汇率（月）',
    description: '根据所属标签分层级',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
  },
]

setupMock({
  setup: () => {
    Mock.mock('/mock/indicator/list', () => {
      return {
        code: 0,
        data: MetricsList,
      }
    })
    Mock.mock('/mock/indicator/detail', ({ body }: any) => {
      const basic = MetricsList.find((v) => v.id == JSON.parse(body)['id'])
      return {
        code: 0,
        data: {
          basic,
          atomics: [
            {
              atomicIdentity: '原子指标1',
              modelName: 'CNY_RATE_1',
              timeField: 'month',
              valueField: 'value',
            },
            {
              atomicIdentity: '原子指标2',
              modelName: 'CNY_RATE_2',
              timeField: 'month_b',
              valueField: 'data',
            },
          ],
          logic: {
            precision: 2,
            frequency: '月',
            unit: '%',
          },
        },
      }
    })
  },
})
