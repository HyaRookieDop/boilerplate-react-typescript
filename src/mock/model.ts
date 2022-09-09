import Mock, { Random } from 'mockjs'

import setupMock from './setupMock'
const modelListData = [
  {
    id: '2222',
    namespace: 'test',
    modelName: 'user',
    description: '用户模型，用来描述用户表信息',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
    defintion: [
      {
        label: 'account',
        type: 'string',
        description: '用户绑定的账户',
        CheckExpression: '/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/',
        isExecute: true,
        length: 128,
        precision: null,
        isNon: true,
        matchField: {
          label: '',
          type: '',
        },
      },
      {
        label: 'name',
        type: 'string',
        description: '用户名称',
        CheckExpression: '/^[\\u4e00-\\u9fa5a-zA-Z0-9_]{1,20}$/',
        length: 128,
        precision: null,
        isNon: true,
        matchField: {
          label: '',
          type: '',
        },
      },
      {
        label: 'age',
        type: 'number',
        description: '年龄',
        CheckExpression: '',
        length: 128,
        precision: null,
        isNon: true,
        matchField: {
          label: '',
          type: '',
        },
      },
      {
        label: 'sex',
        type: 'boolean',
        description: '性别：男-true、女-false',
        CheckExpression: '',
        length: 128,
        precision: null,
        isNon: true,
        matchField: {
          label: '',
          type: '',
        },
      },
    ],
    select: [
      {
        account: 'admin1',
        name: 'admin1',
        age: 18,
        sex: true,
      },
      {
        account: 'admin2',
        name: 'admin2',
        age: 20,
        sex: false,
      },
      {
        account: 'admin3',
        name: 'admin3',
        age: 38,
        sex: true,
      },
      {
        account: 'admin4',
        name: 'admin4',
        age: 48,
        sex: false,
      },
    ],
  },
]

const dataSouceList = [
  {
    id: '1',
    namespace: 'test',
    name: 'Mysql1',
    description: '',
    category: 'database',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
    defintion: {
      jdbcUrl: 'jdbc:mysql://ServerIP:Port/Database',
      user: 'testUser',
      password: 'rootqwe123',
    },
  },
  {
    id: '2',
    namespace: 'test',
    name: 'Mysql2',
    description: '',
    category: 'api',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    createUser: Random.name(),
    updateUser: Random.name(),
    defintion: {
      jdbcUrl: 'jdbc:mysql://ServerIP:Port/Database',
      user: 'testUser',
      password: 'rootqwe123',
    },
  },
]

setupMock({
  setup: () => {
    Mock.mock('/mock/model/list', () => {
      return {
        code: 0,
        data: modelListData.map((v) => {
          const {
            createTime,
            createUser,
            updateTime,
            updateUser,
            namespace,
            modelName,
            id,
            description,
          } = v
          return {
            id,
            namespace,
            modelName,
            description,
            createTime,
            createUser,
            updateTime,
            updateUser,
          }
        }),
      }
    })
    Mock.mock('/mock/model/add', ({ body }: any) => {
      return {
        code: 0,
        data: body,
        msg: '添加成功！',
      }
    })
    Mock.mock('/mock/model/detail', ({ body }: any) => {
      return {
        code: 0,
        data: modelListData.find((v) => v.id === JSON.parse(body)['id']),
      }
    })

    Mock.mock('/mock/source/list', () => {
      return {
        code: 0,
        data: dataSouceList,
      }
    })

    Mock.mock('/mock/source/add', ({ body }: any) => {
      return {
        code: 0,
        data: body,
        msg: '添加成功！',
      }
    })
    Mock.mock('/mock/source/detail', ({ body }: any) => {
      return {
        code: 0,
        data: dataSouceList.find((v) => v.id === JSON.parse(body)['id']),
      }
    })
  },
})
