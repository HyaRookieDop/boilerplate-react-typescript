export function checkStatus(status: number, msg: string): string {
  switch (status) {
    case 400:
      return `${msg}`
      break
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      return '用户没有权限（令牌、用户名、密码错误）!'
      // store.dispatch('user/loginOut', {
      //   goLogin: true,
      // });
      break
    case 403:
      return `${msg}`
      break
    // 404请求不存在
    case 404:
      return '网络请求错误,未找到该资源!'
      break
    case 405:
      return '网络请求错误,请求方法未允许!'
      break
    case 408:
      return '网络请求超时!'
      break
    case 500:
      return '服务器错误,请联系管理员!'
      break
    case 501:
      return '网络未实现!'
      break
    case 502:
      return '网络错误!'
      break
    case 503:
      return '服务不可用，服务器暂时过载或维护!'
      break
    case 504:
      return '网络超时!'
      break
    case 505:
      return 'http版本不支持该请求!'
      break
    default:
      return msg
  }
}
