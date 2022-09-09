interface LabelFieldType extends BasicField {
  id: string;
  namespace: string;
  labelName: string;
  catelog: string;
  remark: string;
}

interface LabelDefintionType extends LabelFieldType {
  logicMainKey: string;
  resultDefinition: Record<string, string>;
  paramDefinition: paramDefinitionType[];
  logicDefinition: logicDefinitionType[];
}

type paramDefinitionType = { name: string; type: string };

type logicDefinitionType = {
  key: string;
  logicType: string;
  logicParam: any;
  matchResult: string;
  unMatchResult: string;
};
