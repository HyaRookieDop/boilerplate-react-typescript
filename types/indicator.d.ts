interface IndicatorFieldType extends BasicField {
  id: string;
  namespace: string;
  indicatorName: string;
  shortName: string;
  belongLabel: string;
  description: string;
}

interface AtomicIndicatorType {
  atomicIdentity: string;
  modelName: string;
  timeField: string;
  valueField: string;
  remark: string;
}

interface AtomicIndicatorLogicType {
  precision: number;
  frequency: string;
  unit: string;
}
