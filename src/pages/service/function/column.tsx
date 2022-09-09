/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:01:47
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-05 16:43:21
 * @FilePath: /rod-asset-front/src/pages/service/function/column.tsx
 * @Description:
 *
 */
import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Popconfirm } from '@douyinfe/semi-ui'

import { TableColumn } from '@/interface/table'

type fc = (record: FunctionFieldType) => void
interface ColumnProps {
  navigate: fc
  edit: fc
  del: fc
}
export const useFunctionColumns = ({
  navigate,
  del,
  edit,
}: ColumnProps): TableColumn<FunctionFieldType>[] => {
  return [
    {
      title: '命名空间',
      dataIndex: 'namespace',
    },
    {
      title: '公式名称',
      dataIndex: 'functionName',
    },
    {
      title: '缩写',
      dataIndex: 'abbreviated',
    },
    {
      title: '描述信息',
      dataIndex: 'description',
    },
    {
      title: '创建信息',
      dataIndex: 'createTime',
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.createUser}</p>
        </div>
      ),
    },
    {
      title: '修改信息',
      dataIndex: 'updateTime',
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.updateUser}</p>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: '$action',
      render: (_, record) => (
        <Dropdown
          zIndex={1000}
          trigger='click'
          position='leftTop'
          render={
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(record)}>公式定义</Dropdown.Item>
              <Dropdown.Item onClick={() => edit(record)}>编辑公式</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此公式？'
                  content='此修改将不可逆'
                >
                  删除公式
                </Popconfirm>
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <IconMore />
        </Dropdown>
      ),
    },
  ]
}
