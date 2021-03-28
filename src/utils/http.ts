// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import axios from 'axios'
import NProgress from 'nprogress'
import { getToken } from '../utils/user'

const token = getToken()
const DEFAULT_TITLE = document.title
const headers: {[k: string]: string} = {}

if (token) {
  headers.Authorization = `token ${token}`
}

const httpInstance = axios.create({
  timeout: 60000 * 3,
  baseURL: 'https://api.github.com',
  headers
})

function startLoad() {
  NProgress.start()
  document.title = 'Connecting...'
}

function stopLoad() {
  NProgress.done()
  document.title = DEFAULT_TITLE
}

Object.setPrototypeOf(httpInstance, axios)

httpInstance.interceptors.request.use(function (config) {
  startLoad()

  return config
}, function (error) {
  stopLoad()
  return Promise.reject(error)
})


httpInstance.interceptors.response.use(function (res) {
  stopLoad()
  return res
}, function (error) {
  stopLoad()
  return Promise.reject(error)
})

export default httpInstance
