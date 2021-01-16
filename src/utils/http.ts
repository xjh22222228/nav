// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import axios, { AxiosError } from 'axios'
import { getToken } from '../utils/user'

function handleError(error: AxiosError) {
}

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: 'https://api.github.com'
})
const token = getToken()

Object.setPrototypeOf(httpInstance, axios)

httpInstance.interceptors.request.use(function (config) {
  config.headers = {
    Authorization: `token ${token}`,
    ...config.headers
  }

  return config
}, function (error) {
  handleError(error)
  return Promise.reject(error)
})


httpInstance.interceptors.response.use(function (res) {

  return res
}, function (error) {
  handleError(error)
  return Promise.reject(error)
})

export default httpInstance
