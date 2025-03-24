// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import localforage from 'localforage'
import { STORAGE_KEY_MAP } from 'src/constants'
import { ActionType } from 'src/types'
import type { ISettings } from 'src/types'

export function getToken() {
  return globalThis.localStorage?.getItem(STORAGE_KEY_MAP.TOKEN) || ''
}

export function getAuthCode() {
  return globalThis.localStorage.getItem(STORAGE_KEY_MAP.AUTH_CODE) || ''
}

export function removeAuthCode() {
  return globalThis.localStorage.removeItem(STORAGE_KEY_MAP.AUTH_CODE)
}

export function setAuthCode(c: string) {
  return globalThis.localStorage.setItem(STORAGE_KEY_MAP.AUTH_CODE, c.trim())
}

export function setToken(token: string) {
  return globalThis.localStorage.setItem(STORAGE_KEY_MAP.TOKEN, token)
}

export function removeToken() {
  return globalThis.localStorage.removeItem(STORAGE_KEY_MAP.TOKEN)
}

export function removeWebsite() {
  return localforage.removeItem(STORAGE_KEY_MAP.WEBSITE)
}

export function userLogout() {
  const removeKeys = [STORAGE_KEY_MAP.TOKEN, STORAGE_KEY_MAP.WEBSITE]
  localforage.clear()
  Array.from({ length: globalThis.localStorage.length }, (_, i) => {
    const key = globalThis.localStorage.key(i)
    if (key && removeKeys.includes(key)) {
      globalThis.localStorage.removeItem(key)
    }
  })
  Array.from({ length: globalThis.sessionStorage.length }, (_, i) => {
    const key = globalThis.sessionStorage.key(i)
    if (key && removeKeys.includes(key)) {
      globalThis.sessionStorage.removeItem(key)
    }
  })
}

export const isLogin: boolean = !!getToken()

let create: null | boolean = null
let edit: null | boolean = null
let del: null | boolean = null

export function getPermissions(settings: ISettings) {
  if (create == null) {
    create = settings.userActions.includes(ActionType.Create)
    edit = settings.userActions.includes(ActionType.Edit)
    del = settings.userActions.includes(ActionType.Delete)
  }

  const c = create || false
  const e = edit || false
  const d = del || false

  return {
    create: c,
    edit: e,
    del: d,
    ok: c || e || d,
  } as const
}
