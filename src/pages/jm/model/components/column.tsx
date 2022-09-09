/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:01:47
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-08 18:29:40
 * @FilePath: /rod-asset-front/src/pages/jm/model/components/column.tsx
 * @Description:
 *
 */
import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Popconfirm } from '@douyinfe/semi-ui'

import { TableColumn } from '@/interface/table'

type fc = (record: ModelItemType) => void
interface ColumnProps {
  edit: fc
  del: fc
}

export const useModelDefintionColumns = ({
  edit,
  del,
}: ColumnProps): TableColumn<ModelItemType>[] => {
  return [
    ...modeItemColumns,
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
              <Dropdown.Item onClick={() => edit(record)}>编辑字段</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此字段？'
                >
                  删除字段
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

export const modeItemColumns: TableColumn<ModelItemType>[] = [
  { title: '字段名', dataIndex: 'fieldName' },
  { title: '字段类型', dataIndex: 'fieldType' },
  { title: '长度', dataIndex: 'filedLength' },
  { title: '精度', dataIndex: 'fieldPrecision' },
  {
    title: '非空',
    dataIndex: 'isEmpty',
    render: (text) => (text ? 'v' : ''),
  },
  { title: '检查表达式', dataIndex: 'checkExpression' },
  { title: '描述信息', dataIndex: 'description' },
]
