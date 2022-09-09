/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:01:47
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-05 16:43:07
 * @FilePath: /rod-asset-front/src/pages/manage/indicator/column.tsx
 * @Description:
 *
 */
import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Popconfirm } from '@douyinfe/semi-ui'

import { TableColumn } from '@/interface/table'

type fc = (record: IndicatorFieldType) => void
interface ColumnProps {
  navigate: fc
  edit: fc
  del: fc
}

export const useIndicatorColumns = ({
  navigate,
  edit,
  del,
}: ColumnProps): TableColumn<IndicatorFieldType>[] => {
  return [
    { title: '命名空间', dataIndex: 'namespace' },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
    },
    {
      title: '指标缩写',
      dataIndex: 'shortName',
    },
    {
      title: '所属标签',
      dataIndex: 'belongLabel',
    },
    { title: '描述信息', dataIndex: 'description' },
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
              <Dropdown.Item onClick={() => edit(record)}>编辑指标</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(record)}>指标定义</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此指标？'
                  content='此修改将不可逆'
                >
                  删除指标
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
