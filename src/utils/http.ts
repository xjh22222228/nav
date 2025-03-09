// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import axios from 'axios'
import NProgress from 'nprogress'
import config from '../../nav.config.json'
import event from './mitt'
import { settings } from 'src/store'
import { getToken, getAuthCode } from '../utils/user'
import { isLogin } from 'src/utils/user'

const httpInstance = axios.create({
  timeout: 60000 * 3,
  baseURL:
    config.address ||
    (config.gitRepoUrl.includes('gitee.com')
      ? 'https://gitee.com/api/v5'
      : 'https://api.github.com'),
})

function startLoad() {
  NProgress.start()
}

function stopLoad() {
  NProgress.done()
}

httpInstance.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `token ${token}`
    }
    startLoad()
    return config
  },
  function (error) {
    stopLoad()
    return Promise.reject(error)
  }
)

httpInstance.interceptors.response.use(
  function (res) {
    stopLoad()
    return res
  },
  function (error) {
    const status =
      error.status || error.response?.data?.status || error.code || ''
    const errorMsg = error.response?.data?.message || error.message || ''
    event.emit('NOTIFICATION', {
      type: 'error',
      title: 'Error：' + status,
      content: errorMsg,
    })
    stopLoad()
    return Promise.reject(error)
  }
)

export const HTTP_BASE_URL = 'https://api.nav3.cn'

const httpNavInstance = axios.create({
  timeout: 15000,
  baseURL: HTTP_BASE_URL,
})

export function getDefaultRequestData(data?: any) {
  const code = getAuthCode()
  return {
    code,
    hostname: location.hostname,
    host: location.host,
    href: location.href,
    isLogin,
    ...config,
    ...data,
    email: settings.email,
    language: settings.language,
  } as const
}

httpNavInstance.interceptors.request.use(
  function (conf) {
    const data = getDefaultRequestData()
    if (data.code) {
      conf.headers['Authorization'] = data.code
    }
    conf.data = getDefaultRequestData(conf.data)
    startLoad()

    return conf
  },
  function (error) {
    stopLoad()
    return Promise.reject(error)
  }
)

httpNavInstance.interceptors.response.use(
  function (res) {
    stopLoad()
    return res
  },
  function (error) {
    let showError = true
    const status =
      error.status || error.response?.data?.status || error.code || ''
    const errorMsg = error.response?.data?.message || error.message || ''
    try {
      if (JSON.parse(error.config.data).showError === false) {
        showError = false
      }
    } catch {}
    if (showError) {
      event.emit('NOTIFICATION', {
        type: 'error',
        title: 'Error：' + status,
        content: errorMsg,
      })
    }

    stopLoad()
    return Promise.reject(error)
  }
)

export const httpNav = httpNavInstance

export default httpInstance
