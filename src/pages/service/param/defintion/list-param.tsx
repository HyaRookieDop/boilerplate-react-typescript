import { IconDelete } from '@douyinfe/semi-icons'
import { Button, Col, Input, Row, Space, Table } from '@douyinfe/semi-ui'
import { FC, useState } from 'react'

import InformationTitle from '@/components/core/information-title'
import { TableColumn } from '@/interface/table'

const ListParam: FC<{
  spearParam: ParamFieldType
}> = () => {
  const [loading] = useState(false)

  const [dynamicDataList, setDynamicDataList] = useState<any[]>([])
  const [dynamicColumns, setDynamicColumns] = useState<TableColumn[]>([])

  function handleAddColumns() {
    const columns = [...dynamicColumns]
    columns.push({
      dataIndex: '',
      title: '',
    })
    setDynamicColumns(columns)
  }

  function handleEditColumns(value: string, index: number) {
    const columns = [...dynamicColumns]
    columns[index] = {
      ...columns[index],
      dataIndex: value,
      title: value,
      key: value,
    }
    setDynamicColumns(columns)
  }

  function handleDelColumns(index: number) {
    const columns = [...dynamicColumns]
    columns.splice(index, 1)
    setDynamicColumns(columns)
  }

  function handleAddDynamicData() {
    const dataList = [...dynamicDataList]
    dataList.push({ index: dataList.length + 1 })
    setDynamicDataList(dataList)
  }

  function handleEditData(value: string, rowIndex: number, column: string | number) {
    const dataList = [...dynamicDataList]
    dataList[rowIndex] = {
      ...dataList[rowIndex],
      column: value,
    }
    setDynamicDataList(dataList)
  }

  return (
    <div>
      <InformationTitle title='列表参数定义信息'></InformationTitle>
      <Row gutter={24}>
        <Col span={1}>
          <Button
            className='!h-full !w-8 !whitespace-pre-wrap'
            block
            theme='solid'
            onClick={handleAddColumns}
          >
            添加标题
          </Button>
        </Col>
        <Col span={23}>
          <Table
            pagination={false}
            bordered
            loading={loading}
            rowKey='index'
            dataSource={dynamicDataList}
          >
            <Table.Column fixed='left' key='index' title='索引' dataIndex='index'></Table.Column>
            {dynamicColumns.map((column, idx) => (
              <Table.Column
                key={column.dataIndex + (idx + '')}
                dataIndex={column.dataIndex + (idx + '')}
                title={
                  <Space style={{ width: '100%' }}>
                    <Input
                      defaultValue={column.dataIndex}
                      onBlur={(e) => handleEditColumns(e.target.value, idx)}
                    ></Input>
                    <Button
                      type='danger'
                      theme='borderless'
                      icon={<IconDelete />}
                      onClick={() => handleDelColumns(idx)}
                    ></Button>
                  </Space>
                }
                render={(text, _, rowIdx) => (
                  <Input
                    defaultValue={text}
                    onBlur={(e) =>
                      handleEditData(e.target.value, rowIdx, column.dataIndex + (idx + ''))
                    }
                  ></Input>
                )}
              ></Table.Column>
            ))}
            <Table.Column
              key='$action'
              title='操作'
              dataIndex='$action'
              width={70}
              fixed='right'
              render={(_, record) => (
                <Button type='danger' theme='borderless' icon={<IconDelete />}></Button>
              )}
            ></Table.Column>
          </Table>
        </Col>
      </Row>

      <Button
        className='!mt-2'
        block
        theme='solid'
        onClick={handleAddDynamicData}
        disabled={dynamicColumns.length === 0}
      >
        添加参数
      </Button>
    </div>
  )
}

export default ListParam
