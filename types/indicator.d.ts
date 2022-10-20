interface QuotaFieldType extends BasicField {
  id: string
  namespace: string
  quotaName: string
  quotaLogogram: string
  label: string
  quotaDesc: string
  queryCondition: string
  timeField: string
  valueField: string
  precision: number
  frequency: string
  dataUnit: string
  modelName: string
  modelId: string
}

interface DataItem {
  periodDate: string
  dataValue: string
}

interface QuoData {
  frequency: number
  precision: number
  dataUnit: string
  quotaDesc: string
  quotaName: string
  data: DataItem[]
}
