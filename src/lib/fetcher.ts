/**
 * https://github.com/axios/axios
 * 基于axios二次封装的request库，支持客户端和服务端
 */
import axios from 'axios'

export function fetcher(options:any) {
  let client = typeof window !== 'undefined'
  const config = {
    // 测试
    // baseURL: options?.baseURL || "https://solanasup.top/",
    // baseURL: options?.baseURL || "http://103.143.231.82:8080",
    baseURL: options?.baseURL || "http://18.143.16.138:8080",
    // baseURL: options?.baseURL || "http://192.168.1.179:8080",
    // baseURL: options?.baseURL || "/atbapi",
    method: options.method || 'post',
    url: options.url,
    data: options.data,
    params: options.params,
    withCredentials: options.withCredentials || false, // 是否允许携带cookie
    ...options,
  }
  if (options?.headers) {
    config['headers'] = options.headers
  }
  return axios(config)
    .then(res => {
      if (options.done) {
        // done回调里不能有window等客户端属性
        options.done(res.data)
      }
      return res.data
    })
    .catch(err => {
      console.error(err)
      if (err.response) {
        if (options.fail) {
          // fail回调里不能有window等客户端属性
          options.fail(err.response)
        }
        return err.response.data
      } else {
        return err
      }
    })
}