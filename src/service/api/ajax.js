import axios from 'axios'

export default function ajax(url='', params={}, type='GET'){
  let promise
  return new Promise((resolve, reject) => {
    if(type.toUpperCase() === 'GET') {    // GET请求
      // 拼接字符串
      let paramsStr = ''
      Object.keys(params).forEach(key => {
        paramsStr += key + '=' + params[key] + '&'
      })
      if(paramsStr) {
        paramsStr.substring(0, paramsStr.lastIndexOf('&'))
      }
      // 拼接完整路径
      url += '?' + paramsStr + '&time=' + (new Date()).valueOf();
      // console.log(url);
      // 发起GET请求
      promise = axios.get(url)
    }else if(type.toUpperCase() === 'POST') {   // POST请求
      // 发起POST请求
      // debugger
      // console.log(params)
      promise = axios.post(url, params)
    }

    promise.then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}