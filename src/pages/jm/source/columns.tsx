import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Popconfirm, Typography } from '@douyinfe/semi-ui'

import { TableColumn } from '@/interface/table'

type fc = (record: DatasourceFieldType) => void
interface ColumnProps {
  edit: fc
  del: fc
  nav: fc
}

export const useSourceColumns = ({
  edit,
  del,
  nav,
}: ColumnProps): TableColumn<DatasourceFieldType>[] => {
  return [
    {
      title: '命名空间',
      dataIndex: 'namespace',
    },
    {
      title: '数据源名称',
      dataIndex: 'datasource',
    },
    {
      title: '数据源类型',
      dataIndex: 'datasourceType',
    },
    {
      title: '数据源描述',
      dataIndex: 'datasourceDesc',
    },
    {
      title: '连接信息',
      dataIndex: 'connectInfo',
      render: (text) => (
        <Typography.Text
          ellipsis={{
            showTooltip: {
              opts: { content: text },
            },
          }}
          style={{ width: 150 }}
        >
          {text}
        </Typography.Text>
      ),
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
              <Dropdown.Item onClick={() => edit(record)}>编辑数据源</Dropdown.Item>
              <Dropdown.Item onClick={() => nav(record)}>数据源定义</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  autoAdjustOverflow
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此数据源？'
                  content='此修改将不可逆'
                >
                  删除数据源
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
