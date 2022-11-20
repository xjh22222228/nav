// Copyright @ 2018-2022 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

export function getToken() {
  return window.localStorage.getItem('token')
}

export function setToken(token: string) {
  return window.localStorage.setItem('token', token)
}

export function removeToken() {
  return window.localStorage.removeItem('token')
}

export const isLogin: boolean = !!getToken()
