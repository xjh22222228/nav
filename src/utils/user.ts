// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
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

export function removeWebsite() {
  return window.localStorage.removeItem('website')
}

export function userLogout() {
  return window.localStorage.clear()
}

export const isLogin: boolean = !!getToken()
