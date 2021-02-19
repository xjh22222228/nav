// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { STORAGE_KEY_MAP } from '../constants'

export function getToken() {
  return window.localStorage.getItem(STORAGE_KEY_MAP.token)
}

export function setToken(token: string) {
  return window.localStorage.setItem(STORAGE_KEY_MAP.token, token)
}
