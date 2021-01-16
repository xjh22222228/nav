// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

export function getToken() {
  return window.localStorage.getItem('token')
}

export function setToken(token: string) {
  return window.localStorage.setItem('token', token)
}
