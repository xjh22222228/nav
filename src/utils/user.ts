// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav
export function getToken() {
  return window.localStorage.getItem('token') || ''
}

export function getAuthCode() {
  return window.localStorage.getItem('AUTH_CODE') || ''
}

export function removeAuthCode() {
  return window.localStorage.removeItem('AUTH_CODE')
}

export function setAuthCode(c: string) {
  return window.localStorage.setItem('AUTH_CODE', c.trim())
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
  const code = getAuthCode()
  window.localStorage.clear()
  setAuthCode(code)
}

export const isLogin: boolean = !!getToken()
