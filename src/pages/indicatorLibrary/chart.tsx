import { FC, Key, useCallback, useEffect, useState } from 'react'
import { Line, Column, Area } from '@ant-design/plots'

import { request } from '@/http'
import { Spin } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { formatCompact, formatDate } from '@/utils/format'
import { LineConfig, Options, BarConfig, AreaConfig, Datum } from '@ant-design/charts'

export interface ChartProps {
  id: Key
  chartType: 'line' | 'smooth' | 'bar' | 'trapezoid' | 'area' | 'stack'
  rangeTime: Dayjs[]
}
const defaultConfig: Options & LineConfig & BarConfig & AreaConfig = {
  data: [] as any[],
  padding: 'auto' as const,
  appendPadding: [24, 0, 24, 0],
  xField: 'periodDate',
  yField: 'dateValue',
  seriesField: 'category',
  xAxis: {
    label: {
      formatter: (value: string) => {
        return formatDate(dayjs(value).toDate())
      },
    },
  },
  yAxis: {
    label: {
      formatter: (value: string) => {
        return formatCompact(parseFloat(value))
      },
    },
  },
  legend: {
    layout: 'horizontal' as const,
    position: 'top-left' as const,
  },
  slider:{
    formatter(val) {
      return formatDate(dayjs(val).toDate())
    },
  },
  tooltip: {
    formatter: (datum: Datum) => {
      return { name: datum.category, value: formatCompact(parseFloat(datum.dateValue)) };
    },
  }
}

const ChartComponent: FC<ChartProps> = ({ id, chartType, rangeTime }) => {
  const [data, setData] =
    useState<Record<string, { quota: Partial<QuotaFieldType>; configData: Partial<any[]> }>>()
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState(defaultConfig)

  const getData = useCallback(() => {
    setLoading(true)
    Promise.all([
      request<QuotaFieldType>({
        url: '/fxdata_quota/detail/' + id,
        method: 'get',
      }),
      request<QuoData>({
        url: '/fxdata_quota/data/' + id,
        method: 'get',
        params: {
          startDate: rangeTime[0].format('YYYY-MM-DD'),
          endDate: rangeTime[1].format('YYYY-MM-DD'),
          frequency: 4,
        },
      }),
    ])
      .then((res) => {
        const [{ data: quota }, { data: quotaData }] = res
        const configData =
          quotaData?.data?.map((item) => ({
            ...item,
            category: `${quota.quotaName}（${quota.dataUnit}，左轴）`,
          })) || []
        setData((origin) => {
          return {
            ...origin,
            [id]: {
              quota,
              configData,
            },
          }
        })

        setConfig((origin) => ({ ...origin, data: configData }))
      })
      .finally(() => setLoading(false))
  }, [id, rangeTime])

  useEffect(() => {
    if (id && rangeTime) {
      getData()
    }
  }, [getData, id, rangeTime])

  return (
    <Spin spinning={loading}>
      {(chartType === 'line' || chartType === 'smooth' || chartType === 'trapezoid') && (
        <Line
          {...config}
          smooth={chartType === 'smooth'}
          stepType={chartType === 'trapezoid' ? 'hvh' : ''}
        ></Line>
      )}
      {(chartType === 'bar' || chartType === 'stack') && (
        <Column {...config} isStack={chartType === 'stack'}></Column>
      )}
      {chartType === 'area' && <Area {...config}></Area>}
    </Spin>
  )
}

export default ChartComponent
