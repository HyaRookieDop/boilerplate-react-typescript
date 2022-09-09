import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Popconfirm, Tag, Tooltip, Typography } from '@douyinfe/semi-ui'

import { TableColumn } from '@/interface/table'

type fc = (record: ParamFieldType) => void
interface ColumnProps {
  navigate: fc
  edit: fc
  del: fc
}
export const useParamColumns = ({
  navigate,
  del,
  edit,
}: ColumnProps): TableColumn<ParamFieldType>[] => {
  return [
    {
      title: '命名空间',
      dataIndex: 'namespace',
    },
    {
      title: '参数名',
      dataIndex: 'paramName',
      render: (text, record) => (
        <Tooltip content='点击跳转到参数定义'>
          <Typography.Text
            link={{
              href: `param/${record.id}`,
            }}
          >
            {text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: '参数定义',
      dataIndex: 'paramData',
      render: (text) =>
        text && (
          <Typography.Text
            code
            ellipsis={{
              showTooltip: { opts: { className: 'break-all' } },
            }}
            style={{ width: 200 }}
          >
            {text}
          </Typography.Text>
        ),
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      render: (text) => text && <Tag>{text}</Tag>,
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
              <Dropdown.Item onClick={() => navigate(record)}>参数定义</Dropdown.Item>
              <Dropdown.Item onClick={() => edit(record)}>编辑参数</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此参数？'
                  content='此修改将不可逆'
                >
                  删除参数
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
