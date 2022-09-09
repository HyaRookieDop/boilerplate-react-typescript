import './index.scss'
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconClose, IconVerify, IconSave } from '@douyinfe/semi-icons'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputGroup,
  RadioGroup,
  Row,
  Select,
  Space,
  Table,
  TabPane,
  Tabs,
  TextArea,
  Typography,
} from '@douyinfe/semi-ui'
import {
  FC,
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'

import InformationTitle from '@/components/core/information-title'
import useMounted from '@/hooks/useMounted'
import useRequest, { request } from '@/http'
import { httpBodyTypeOptions, httpMethodOptions } from '@/utils/httpMethods'

import { SourceForm } from '..'
import { DetailWrapper } from '@/components/core/DetailContainer'
import { updateQueryStringParameter } from '@/utils/util'

const protocols = ['http://', 'https://']

const protocolOpts = protocols.map((v) => {
  return {
    label: v,
    value: v,
  }
})

export const DataSourceDefintionPage: FC = () => {
  const { id } = useParams()
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const formApi1 = useRef<BaseFormApi<DatasourceFieldType>>()
  const formApi2 = useRef<BaseFormApi<DatabaseType>>()
  const forwardRef = useRef<{
    getData: () => string
    setData: (value: HttpConnectionType) => void
  }>()
  const { data, mutate } = useRequest<DatasourceFieldType>(
    {
      url: '/fxdata_source/detail/' + id,
      method: 'get',
    },
    { suspense: true },
  )
  const { mounted } = useMounted(data?.datasource)

  useEffect(() => {
    if (data) {
      if (data.datasourceType === 'API') {
        forwardRef.current?.setData(JSON.parse(data.connectInfo) as HttpConnectionType)
      } else {
        formApi2.current?.setValues(JSON.parse(data.connectInfo) as DatabaseType)
      }
    }
  }, [data])

  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])

  function verifyConnection() {
    setVerifyLoading(true)
    formApi2.current
      ?.validate()
      .then(async (form) => {
        await request(
          {
            url: '/fxdata_source/verify_connect',
            method: 'post',
            data: form,
          },
          { successMsg: '验证通过' },
        ).finally(() => setVerifyLoading(false))
      })
      .catch(() => {
        formApi2.current?.scrollToField('username', { behavior: 'smooth' })
        setVerifyLoading(false)
      })
  }

  function saveDefintion() {
    setSaveLoading(true)
    formApi1.current
      ?.validate()
      .then(async (form) => {
        const info = {
          [form.datasourceType === 'API' ? 'connectInfo' : 'databaseInfo']:
            form.datasourceType === 'API'
              ? forwardRef.current?.getData()
              : formApi2.current?.getValues(),
        }
        const params = {
          ...form,
          ...info,
          id,
        }
        await request(
          {
            url: '/fxdata_source/edit',
            method: 'post',
            data: params,
          },
          { successMsg: '保存成功' },
        ).finally(() => setSaveLoading(false))
      })
      .catch((err) => {
        formApi1.current?.scrollToField('datasource', { behavior: 'smooth' })
        setSaveLoading(false)
      })
  }

  return (
    <DetailWrapper
      action={[
        <Button
          key='save'
          theme='solid'
          icon={<IconSave />}
          loading={saveLoading}
          onClick={saveDefintion}
        >
          保存定义
        </Button>,
        data?.datasourceType === 'MYSQL' && (
          <Button
            className='!ml-3'
            key='verify'
            theme='solid'
            type='secondary'
            icon={<IconVerify />}
            loading={verifyLoading}
            onClick={verifyConnection}
          >
            测试连通性
          </Button>
        ),
      ]}
    >
      <Card>
        <InformationTitle title='来源基本信息'></InformationTitle>
        <SourceForm
          className='lg:w-full xl:w-1/2'
          formApi={formApi1}
          values={data as DatasourceFieldType}
          labelPosition='left'
          labelWidth={100}
        ></SourceForm>
        <InformationTitle title='来源定义信息'></InformationTitle>
        {data?.datasourceType === 'MYSQL' && (
          <DatabaseComponent formApi={formApi2}></DatabaseComponent>
        )}
        {data?.datasourceType === 'API' && <APIComponent ref={forwardRef}></APIComponent>}
      </Card>
    </DetailWrapper>
  )
}

export default DataSourceDefintionPage
const DatabaseComponent: FC<{
  formApi: MutableRefObject<BaseFormApi<DatabaseType> | undefined>
}> = ({ formApi }) => {
  return (
    <div className='flex items-end'>
      <Form
        getFormApi={(api) => {
          if (formApi) {
            formApi.current = api
          }
        }}
        labelPosition='left'
        labelWidth={100}
        className='lg:w-full xl:w-1/2'
      >
        <Form.Input
          field='jdbcUrl'
          label='url协议'
          rules={[{ required: true, message: 'url协议不能为空' }]}
        ></Form.Input>
        <Form.Input
          field='driverClassName'
          label='驱动名称'
          rules={[{ required: true, message: '驱动名称不能为空' }]}
        ></Form.Input>
        <Form.Input
          field='username'
          label='用户名'
          rules={[{ required: true, message: '用户名不能为空' }]}
        ></Form.Input>
        <Form.Input
          autoComplete='new-password'
          mode='password'
          field='password'
          label='密码'
          rules={[{ required: true, message: '密码不能为空' }]}
        ></Form.Input>
      </Form>
    </div>
  )
}

const APIComponent = forwardRef(function component(_props, ref) {
  const [contentType, setContentType] = useState('none')
  const [raw, setRaw] = useState('')
  const [protocol, setProtocols] = useState('http://')
  const [form, setForm] = useState<HttpConnectionType>({
    url: '',
    method: 'GET',
    params: [],
    headers: [],
    body: [],
  })
  const [loading] = useState(false)

  function handleChangeForm(field: keyof HttpConnectionType, value: any) {
    if (field === 'params' && form.url.length > 0) {
      let url = form.url
      value.forEach((v: IterableType) => {
        url = updateQueryStringParameter(url, v.KEY, v.VALUE)
      })
      setForm((prevForm) => {
        return { ...prevForm, [field]: value, url }
      })
    } else {
      setForm((prevForm) => {
        return { ...prevForm, [field]: value }
      })
    }
  }

  async function handleTestConnection() {
    const headers = {} as Record<string, string>
    let body: any = null
    form.headers.forEach((v) => {
      if (v.KEY.trim() !== '') {
        headers[v.KEY] = v.VALUE
      }
    })
    if (contentType !== 'none') {
      if (contentType === 'application/json') {
        body = raw
      } else {
        const map = {
          'multipart/form-data': new FormData(),
          'application/x-www-form-urlencoded': new URLSearchParams(),
        } as Record<string, any>
        const formData = map[contentType]
        form.body.forEach((v) => {
          if (v.KEY.trim() !== '') {
            formData.append(v.KEY, v.VALUE)
          }
        })
        body = formData
      }
    }
    // setLoading(true);
    // const response = await fetch(protocol + form.url, {
    //   method: form.method,
    //   redirect: "follow",
    //   headers,
    //   body,
    // }).finally(() => setLoading(false));
  }

  useImperativeHandle(ref, () => ({
    getData: () => {
      const params = {
        params: form.params.filter((v) => v.KEY.trim() !== ''),
        headers: form.headers.filter((v) => v.KEY.trim() !== ''),
        body:
          contentType === 'none'
            ? ''
            : contentType === 'application/json'
            ? raw
            : form.body.filter((v) => v.KEY.trim() !== ''),
        url: protocol + form.url,
      }
      return JSON.stringify(params)
    },
    setData: (params: HttpConnectionType) => {
      if (params) {
        setForm((prevForm) => {
          const headerContentType = params.headers.find((v) => v.KEY === 'Content-Type')
          const ctp = headerContentType ? headerContentType.VALUE : 'none'
          setContentType(ctp)
          let body: any = null
          if (ctp === 'application/json' || ctp === 'none') {
            setRaw(JSON.stringify(params.body))
            body = []
          } else {
            body = params.body
          }
          return { ...prevForm, ...params, body }
        })
      }
    },
  }))

  return (
    <div>
      <Row type='flex' justify='space-between' gutter={16}>
        <Col span={20}>
          <InputGroup size='large' className='!flex !flex-nowrap'>
            <Select
              placeholder='请求方法'
              defaultValue='GET'
              optionList={httpMethodOptions}
              value={form.method}
              onChange={(value) => handleChangeForm('method', value)}
            ></Select>
            <Input
              addonBefore={
                <Select
                  value={protocol}
                  optionList={protocolOpts}
                  onChange={(value) => setProtocols(value as string)}
                  triggerRender={({ value }: any) => (
                    <span className='mx-2'>{value.map((v: { label: any }) => v.label)}</span>
                  )}
                ></Select>
              }
              placeholder='输入接口地址'
              value={form.url}
              onChange={(value) => handleChangeForm('url', value)}
            ></Input>
          </InputGroup>
        </Col>
        <Col span={4}>
          <Button
            size='large'
            theme='solid'
            type='secondary'
            icon={<IconVerify />}
            loading={loading}
            onClick={handleTestConnection}
          >
            测试链接
          </Button>
        </Col>
      </Row>
      <Tabs
        className='mt-2'
        type='line'
        defaultActiveKey='1'
        contentStyle={{
          boxShadow: 'none',
          paddingLeft: '0',
          paddingRight: '0',
          paddingTop: '1rem',
        }}
      >
        <TabPane tab='Params' itemKey='1'>
          <div>
            <Typography.Title heading={6}>QueryParams</Typography.Title>
            <TTable
              key='params'
              type='params'
              value={form.params}
              setValue={(dataList) => handleChangeForm('params', dataList)}
            ></TTable>
          </div>
        </TabPane>
        <TabPane tab='Headers' itemKey='2'>
          <div>
            <Typography.Title heading={6}>Headers</Typography.Title>
            <TTable
              key='headers'
              type='headers'
              value={form.headers}
              setValue={(dataList) => handleChangeForm('headers', dataList)}
            ></TTable>
          </div>
        </TabPane>
        <TabPane tab='Body' itemKey='3'>
          <div>
            <RadioGroup
              defaultValue='none'
              options={httpBodyTypeOptions}
              value={contentType}
              onChange={(e) => {
                setContentType(e.target.value)
                const headers = [...form.headers]
                const index = headers.findIndex((v) => v.KEY === 'Content-Type')
                if (index !== -1) {
                  headers[index].VALUE = e.target.value
                } else {
                  headers.push({
                    KEY: 'Content-Type',
                    VALUE: e.target.value,
                  })
                }
                handleChangeForm('headers', headers)
              }}
            ></RadioGroup>
            {contentType === 'none' ? (
              <div className='p-3 text-center text-gray-300'>
                <p>这个请求没有Body</p>
              </div>
            ) : contentType === 'application/json' ? (
              <TextArea value={raw} onChange={(value) => setRaw(value)}></TextArea>
            ) : (
              <TTable
                key='body'
                type='body'
                value={form.body}
                setValue={(dataList) => handleChangeForm('body', dataList)}
              ></TTable>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
})

const TTable: FC<{
  value: IterableType[]
  setValue: (dataList: IterableType[]) => void
  type: 'params' | 'headers' | 'body'
}> = ({ value, setValue, type }) => {
  const [dataList, setDataList] = useState<IterableType[]>(value)

  function handleClose(index: number) {
    const list = [...dataList]
    list.splice(index, 1)
    setDataList(list)
  }

  function handleChange(value: string, index: number, key: keyof IterableType) {
    const list = [...dataList]
    if (value.length === 1) {
      if (index === dataList.length - 1) {
        list.push({ KEY: '', VALUE: '', DESC: '' })
        setDataList(list)
      }
    }

    list[index][key] = value
    setDataList(list)
  }

  function getKey(dataIndex: string, index: number) {
    return type + dataIndex + index
  }

  useEffect(() => {
    setValue(dataList)
  }, [dataList])

  useEffect(() => {
    const list = [...dataList]
    list.push({ KEY: '', VALUE: '', DESC: '' })
    setDataList(list)
  }, [])

  return (
    <Table
      className='custom-table'
      bordered
      columns={[
        {
          title: 'key',
          dataIndex: 'KEY',
          render: (text, record, index) => (
            <Input
              key={getKey('KEY', index)}
              size='small'
              onChange={(value) => handleChange(value, index, 'KEY')}
              placeholder='key'
              value={text}
            ></Input>
          ),
        },
        {
          title: 'value',
          dataIndex: 'VALUE',
          render: (text, record, index) => (
            <Input
              key={getKey('VALUE', index)}
              size='small'
              onChange={(value) => handleChange(value, index, 'VALUE')}
              placeholder='value'
              value={text}
            ></Input>
          ),
        },
        {
          title: 'desc',
          dataIndex: 'DESC',
          render: (text, record, index) => (
            <Space className='w-full'>
              <Input
                key={getKey('DESC', index)}
                size='small'
                onChange={(value) => handleChange(value, index, 'DESC')}
                placeholder='description'
                value={text}
              ></Input>
              {index < dataList.length - 1 && (
                <IconClose
                  className='cell-icon cursor-pointer'
                  onClick={() => handleClose(index)}
                ></IconClose>
              )}
            </Space>
          ),
        },
      ]}
      dataSource={dataList}
    ></Table>
  )
}
