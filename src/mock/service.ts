import Mock, { Random } from 'mockjs'

import setupMock from './setupMock'

const FunctionList = [
  {
    id: '1',
    namespace: 'test',
    functionName: 'Unrealized gains losses',
    abbreviated: 'ugl',
    description: '未实现的汇兑损益: 敞口 *（当月汇率-上月汇率）',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
    relations: [],
  },
  {
    id: '2',
    namespace: 'test',
    functionName: 'MAX',
    abbreviated: 'MAX',
    description: 'MAX(number1,number2,...)，返回一组数据当中最大数据',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
  },
]

const ParamList = [
  {
    id: '42',
    namespace: 'test',
    paramName: 'nametest',
    paramType: 'NUMBER',
    paramData: '6666',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
  },
  {
    id: '41',
    namespace: 'test',
    paramName: 'RISK_DIAGNOSIS_LABEL_NAME',
    paramType: 'JSON',
    paramData:
      '{"one":{"below": "人民币100万以下","between": "人民币100万-500万","above": "人民币500万以上"},"two": {"approach":"接近现状","gt":"数字大于现状","lt":"数字小于现状","unaware":"不了解敞口是什么"},"labelName":"RISK_DIAGNOSIS_LABEL_NAME"}',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
  },

  {
    id: '45',
    namespace: 'test',
    paramName: 'factor_list',
    paramType: 'LIST',
    paramData: '"{"title":[{"name":"name","type":"STRING"},{"name":"sex","type":"STRING"}]}"',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
  },
]

const listData = {
  3: {
    data: [
      {
        index: 1,
        name: 'name',
        type: 'NUMBER',
        value: 'admin',
        id: 21,
      },
      {
        index: 1,
        name: 'age',
        type: 'NUMBER',
        value: '15',
        id: 22,
      },
      {
        index: 1,
        name: 'sex',
        type: 'NUMBER',
        value: '1',
        id: 22,
      },
    ],
    title: [
      { name: 'name', type: 'STRING' },
      { name: 'age', type: 'NUMBER' },
      { name: 'sex', type: 'NUMBER' },
    ],
  },
  4: {
    title: [
      { name: '1', type: 'NUMBER' },
      { name: '2', type: 'NUMBER' },
    ],
  },
} as Record<number, any>

setupMock({
  setup: () => {
    Mock.mock('/mock/function/list', () => {
      return {
        code: 0,
        data: FunctionList,
      }
    })
    Mock.mock('/mock/function/add', ({ body }: any) => {
      return {
        code: 0,
        data: body,
        msg: '添加成功！',
      }
    })
    Mock.mock('/mock/function/detail', ({ body }: any) => {
      return {
        code: 0,
        data: FunctionList.find((v) => v.id === JSON.parse(body)['id']),
      }
    })

    Mock.mock('/mock/param/list', () => {
      return {
        code: 0,
        data: ParamList,
      }
    })

    Mock.mock('/mock/param/ListListParamById', ({ body }: any) => {
      return {
        code: 0,
        data: listData[JSON.parse(body)['id']],
      }
    })
  },
})
