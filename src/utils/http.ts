// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import axios from 'axios'
import NProgress from 'nprogress'
import { getToken } from '../utils/user'

const httpInstance = axios.create({
  timeout: 60000 * 3,
  baseURL: 'https://api.github.com'
})
const token = getToken()

Object.setPrototypeOf(httpInstance, axios)

httpInstance.interceptors.request.use(function (config) {
  NProgress.start()

  config.headers = {
    Authorization: `token ${token}`,
    ...config.headers
  }

  return config
}, function (error) {
  NProgress.done()
  return Promise.reject(error)
})


httpInstance.interceptors.response.use(function (res) {
  NProgress.done()
  return res
}, function (error) {
  NProgress.done()
  return Promise.reject(error)
})

export default httpInstance
