/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 14:59:28
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-09 10:57:33
 * @FilePath: /rod-asset-front/types/model.d.ts
 * @Description:
 *
 */
interface ModelFieldType extends BasicField {
  id: string;
  namespace: string;
  modelName: string;
  modeDesc: string;
}

interface ModelItemType extends BasicField {
  id: string;
  fieldName: string;
  fieldType: string;
  description: string;
  checkExpression: string;
  fieldPrecision: number;
  filedLength: number;
  fxdataModelId: string;
  isDel: boolean;
  isEmpty: boolean;
  datasourceId?: string;
  sourceTable?: string;
  sourceField?: string;
  tableName?: string;
}

interface DatasourceFieldType extends BasicField {
  id: string;
  namespace: string;
  datasource: string;
  datasourceType: MYSQL | API | POSTGRES | "";
  datasourceDesc: string;
  connectInfo: string;
}

interface DatabaseType {
  driverClassName: string;
  jdbcUrl: string;
  password: string;
  username: string;
}

interface HttpConnectionType {
  url: string;
  method: string;
  params: IterableType[];
  headers: IterableType[];
  body: IterableType[];
}

interface IterableType {
  KEY: string;
  VALUE: string;
  DESC?: string;
}
