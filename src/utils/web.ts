// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import event from 'src/utils/mitt'
import localforage from 'localforage'
import navConfig from '../../nav.config.json'
import { updateFileContent } from 'src/api'
import { isLogin } from './user'
import { IWebProps, INavProps } from '../types'
import { navs } from 'src/store'
import { STORAGE_KEY_MAP, DB_PATH } from 'src/constants'
import { isSelfDevelop } from './utils'
import { queryString, getClassById } from './index'
import { $t } from 'src/locale'
import { filterLoginData } from './pureUtils'

export async function getNavs() {
  if (isSelfDevelop) {
    return
  }
  function finish(navsData: INavProps[]) {
    navs.set(navsData)
    event.emit('WEB_FINISH')
    window.__FINISHED__ = true
  }
  const data = filterLoginData(navs(), isLogin)
  if (!isLogin) {
    return finish(data)
  }
  const storageDate = window.localStorage.getItem(STORAGE_KEY_MAP.DATE_TIME)

  // 检测到网站更新，清除缓存本地保存记录失效
  if (storageDate !== navConfig.datetime) {
    const removeKeys = [STORAGE_KEY_MAP.WEBSITE, STORAGE_KEY_MAP.DATE_TIME]
    Array.from({ length: globalThis.localStorage.length }, (_, i) => {
      return globalThis.localStorage.key(i)
    }).forEach((key) => {
      if (key && removeKeys.includes(key)) {
        globalThis.localStorage.removeItem(key)
      }
    })
    globalThis.localStorage.setItem(
      STORAGE_KEY_MAP.DATE_TIME,
      navConfig.datetime,
    )
    localforage.removeItem(STORAGE_KEY_MAP.WEBSITE)
    finish(data)
    if (isLogin) {
      setTimeout(() => {
        event.emit('NOTIFICATION', {
          type: 'success',
          title: $t('_buildSuccess'),
          content: navConfig.datetime,
          config: {
            nzDuration: 0,
          },
        })
      }, 1000)
    }
    return
  }

  try {
    const navsData: any =
      (await localforage.getItem(STORAGE_KEY_MAP.WEBSITE)) || data
    finish(navsData)
  } catch {
    finish(data)
  }
}

export function setNavs(navs: INavProps[]): Promise<any> {
  if (isSelfDevelop) {
    return updateFileContent({
      content: JSON.stringify(navs),
      path: DB_PATH,
    })
  }
  return localforage.setItem(STORAGE_KEY_MAP.WEBSITE, navs)
}

export function toggleCollapseAll(navs: INavProps[]): boolean {
  const { id } = queryString()
  const { oneIndex, twoIndex } = getClassById(id)
  const collapsed = !navs[oneIndex].nav[twoIndex].collapsed
  navs[oneIndex].nav[twoIndex].collapsed = collapsed
  navs[oneIndex].nav[twoIndex].nav.map((item) => {
    item.collapsed = collapsed
    return item
  })
  if (!isSelfDevelop) {
    setNavs(navs)
  }
  return collapsed
}

export async function deleteWebByIds(
  ids: number[],
  isDelRid = false,
): Promise<boolean> {
  let hasDelete = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (Array.isArray(item.nav)) {
        item.nav = item.nav.filter((w: IWebProps) => {
          if (w.name) {
            if (ids.includes(isDelRid ? (w.rId as number) : w.id)) {
              hasDelete = true
              return false
            }
          }
          return true
        })
        f(item.nav)
      }
    }
  }
  const navsData = navs()
  f(navsData)
  if (hasDelete) {
    await setNavs(navsData)
    const { q } = queryString()
    if (q && !isSelfDevelop) {
      event.emit('WEB_REFRESH')
    }
  }
  return hasDelete
}

export function updateByWeb(oldId: number, newData: IWebProps) {
  const keys = Object.keys(newData)
  let ok = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item['name']) {
        if (item.id === oldId) {
          ok = true
          for (let k of keys) {
            item[k] = newData[k]
          }
        }
      }

      if (Array.isArray(item.nav)) {
        f(item.nav)
      }
    }
  }

  const navsData = navs()
  f(navsData)
  navs.set(navsData)
  setNavs(navsData)
  return ok
}

export function getWebById(id: number): IWebProps | null {
  let web: IWebProps | null = null
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item['name']) {
        if (item.id === id) {
          web = item
          break
        }
      }

      if (Array.isArray(item.nav)) {
        f(item.nav)
      }
    }
  }
  f(navs())
  return web
}

export function updateByClass(oldId: number, newData: any) {
  const keys = Object.keys(newData)
  let ok = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.title) {
        if (item.id === oldId) {
          ok = true
          for (let k of keys) {
            item[k] = newData[k]
          }
        }
      }

      if (Array.isArray(item.nav) && !item.nav[0]?.['name']) {
        f(item.nav)
      }
    }
  }

  const navsData = navs()
  f(navsData)
  navs.set(navsData)
  setNavs(navsData)
  return ok
}

export async function deleteClassByIds(
  ids: number[],
  isDelRid = false,
): Promise<boolean> {
  let hasDelete = false

  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (Array.isArray(item.nav)) {
        f(item.nav)
        if (item.nav[0]?.name) {
          break
        }
        item.nav = item.nav.filter((w: INavProps) => {
          if (w.title) {
            if (ids.includes(isDelRid ? (w['rId'] as number) : w.id)) {
              hasDelete = true
              return false
            }
          }
          return true
        })
      }
    }
  }

  const navsData = navs()
  // 删除一级分类
  ids.forEach((id) => {
    navsData.forEach((item, index) => {
      if (item.id === id) {
        hasDelete = true
        navsData.splice(index, 1)
      }
    })
  })

  f(navsData)
  if (hasDelete) {
    navs.set(navsData)
    await setNavs(navsData)
  }
  return hasDelete
}

export function pushDataByAny(parentId: number, data: any): boolean {
  let ok = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.title) {
        if (item.id === parentId) {
          ok = true
          item.nav.unshift(data)
        }
      }

      if (Array.isArray(item.nav)) {
        f(item.nav)
      }
    }
  }

  const navsData = navs()
  f(navsData)
  navs.set(navsData)
  setNavs(navsData)
  return ok
}
