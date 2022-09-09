import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table'
export type TableColumn<T extends Record<string, any>>  =  ColumnProps<T> & {
  dataIndex: keyof T | '$action'
  key?: keyof T | '$action'
}

