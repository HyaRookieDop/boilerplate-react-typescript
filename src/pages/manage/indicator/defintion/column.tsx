import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Popconfirm } from '@douyinfe/semi-ui'

import { TableColumn } from '@/interface/table'

type fc = (record: AtomicIndicatorType) => void
interface ColumnProps {
  edit: fc
  del: fc
}

export const useAtomicColumns = ({
  edit,
  del,
}: ColumnProps): TableColumn<AtomicIndicatorType>[] => {
  return [
    { title: '原子标识', dataIndex: 'atomicIdentity' },
    { title: '模型标识', dataIndex: 'modelName' },
    { title: '时间字段', dataIndex: 'timeField' },
    { title: '原子值', dataIndex: 'valueField' },
    { title: '备注', dataIndex: 'remark' },
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
              <Dropdown.Item onClick={() => edit(record)}>编辑</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此原子值？'
                >
                  删除
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
