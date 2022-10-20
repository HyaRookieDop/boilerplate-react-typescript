import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

import { ResultEnum } from '@/enum/httpEnum'

import { checkStatus } from './checkStatus'

export interface RequestOptions {
  /** 请求成功时提示信息 */
  successMsg?: string
  /** 请求失败时提示信息 */
  errorMsg?: string
  isShowMessage?: boolean
  isShowErrorMessage?: boolean
  isShowSuccessMessage?: boolean
  /** 是否mock数据请求 */
  isMock?: boolean
}

const UNKNOWN_ERROR = '未知错误，请重试'

const service = axios.create({
  // baseURL: baseApiUrl,
  timeout: 30 * 1000,
})

service.interceptors.request.use(
  (config) => {
    if (config.url?.includes('api_param')) {
      config.url = 'http://spear-param.dev3.fxexpert.cn' + config.url.replace(/^\/api_param/, '')
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response, code, message } = error || {}
    if (code && code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      //       Toast.error('接口请求超时,请刷新页面重试!')
      return
    } else {
      if (response && response.data) {
        //         Toast.error(checkStatus(response && response.status, response?.data?.msg))
      } else {
        const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR
        error.message = errMsg
        //         Toast.error(checkStatus(response && response.status, errMsg))
      }
    }
    return Promise.reject(error)
  },
)

/**
 *
 * @param config
 * @param options
 */
export const request = async <T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<BasicResponseModel<T>> => {
  try {
    options = {
      successMsg: '',
      errorMsg: '',
      isShowMessage: true,
      isShowSuccessMessage: false,
      isShowErrorMessage: true,
      ...options,
    }

    if (MODE === 'local') {
      config.url =  '/api' + config.url
    } else {
      config.url = API_URL + config.url
    }

    const response = await service.request<BasicResponseModel<T>>(config)
    handleResponseMsg(response, options)
    return response.data
  } catch (error) {
    console.log('http error', error)

    return Promise.reject(error)
  }
}

function handleResponseMsg<T>(
  response: AxiosResponse<BasicResponseModel<T>>,
  opts: RequestOptions = {},
) {
  const { isShowErrorMessage, isShowMessage, isShowSuccessMessage, successMsg, errorMsg } = opts
  const { data } = response
  if (isShowMessage) {
    if (data && Reflect.has(data, 'responseCode') && data.responseCode === ResultEnum.SUCCESS) {
      if (isShowSuccessMessage || successMsg) {
        //         Toast.success(successMsg || data.responseMessage)
      }
    } else {
      if (isShowErrorMessage || errorMsg) {
        //         Toast.error(errorMsg || data.responseMessage || UNKNOWN_ERROR)
      }
      return Promise.reject(response)
    }
  }
}

interface Config<JsonData = unknown, Error = unknown>
  extends Omit<SWRConfiguration<AxiosResponse<JsonData>, AxiosError<Error>>, 'initialData'> {
  initialData?: JsonData
}

interface Return<T, Error>
  extends Pick<
    SWRResponse<AxiosResponse<BasicResponseModel<T>>, AxiosError<Error>>,
    'isValidating' | 'mutate'
  > {
  data: T | undefined
  response: BasicResponseModel<T> | undefined
  requestKey: string | null
  error?: AxiosError<Error, any>
  axiosResponse: AxiosResponse<BasicResponseModel<T>>
  loading: boolean
}

/**
 * @param params 请求参数 {AxiosRequestConfig}
 * @param swrOptions swr选项 {SWRConfiguration}
 * @returns swrResponse 返回对象 {SWRResponse}
 */
export default function useRequest<R = any, D = any, Error = unknown>(
  params: AxiosRequestConfig<D>,
  swrOptions: Config<BasicResponseModel<R>, Error> = {},
  options: RequestOptions = {},
): Return<R, Error> {
  const { url } = params
  const requestKey = url ? url : null

  if (MODE === 'local') {
    params.url = options.isMock ? '/mock' + params.url : '/api' + params.url
  } else {
    params.url = API_URL + params.url
  }

  const { data, isValidating, error, mutate } = useSWR<
    AxiosResponse<BasicResponseModel<R>>,
    AxiosError<Error>
  >(requestKey, () => service(params), { ...swrOptions })

  if (requestKey && data) {
    handleResponseMsg(data as any, options)
  }

  return {
    data: data?.data.data,
    isValidating,
    loading: !error && !data,
    error,
    mutate,
    requestKey,
    response: data?.data,
    axiosResponse: data as AxiosResponse,
  }
}
