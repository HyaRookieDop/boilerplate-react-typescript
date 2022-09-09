export const paramTypeOptions = [
  {
    label: '字符',
    value: 'STRING',
    paramData: 'paramStringValue',
    helpMessage: '',
  },
  {
    label: '数字',
    value: 'NUMBER',
    paramData: 'paramNumberValue',
    helpMessage: '',
  },
  {
    label: 'JSON',
    value: 'JSON',
    paramData: 'paramJsonValue',
    helpMessage: '参数类型为json时，参数定义格式需要为json格式',
  },
  {
    label: '字符数组',
    value: 'STRING_ARRAY',
    paramData: 'paramStringArray',
    helpMessage: '参数类型为字符数组时，参数定义格式需要为字符数组格式',
  },
  {
    label: '数字数组',
    value: 'NUMBER_ARRAY',
    paramData: 'paramNumberArray',
    helpMessage: '参数类型为数字数组时，参数定义格式需要为数字数组格式',
  },
  {
    label: '自定义',
    value: 'CUSTOM',
    paramData: 'paramRawValue',
    helpMessage: '参数类型为自定义时，具体格式由接入方系统指定子参数类型确定',
  },
  {
    label: '列表',
    value: 'LIST',
    paramData: 'paramData',
    helpMessage: '参数类型为列表时，前往列表参数定义编辑此项',
  },
  {
    label: '树状',
    value: 'TREE',
    paramData: 'paramData',
    helpMessage: '参数类型为树状时，前往树状参数定义编辑此项',
  },
]
