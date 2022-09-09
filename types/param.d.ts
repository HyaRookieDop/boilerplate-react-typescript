interface ParamFieldType extends BasicField {
  id: string;
  namespace: string;
  paramName: string;
  paramType: string;
  paramData: string;
  description: string;
}

interface ParamtricListTitle {
  name: string;
  type: string;
}

interface ParamtricListData {
  name: string;
  type: string;
  index: number;
  value: string;
}
