/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 15:20:41
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-05 17:19:26
 * @FilePath: /rod-asset-front/src/enum/httpEnum.ts
 * @Description:
 *
 */
/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = 'success',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
