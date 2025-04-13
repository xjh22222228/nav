// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import event from 'src/utils/mitt'
import localforage from 'localforage'
import navConfig from '../../nav.config.json'
import { updateFileContent } from 'src/api'
import { isLogin } from './user'
import { IWebProps, INavProps } from '../types'
import { websiteList } from 'src/store'
import { STORAGE_KEY_MAP, DB_PATH } from 'src/constants'
import { isSelfDevelop } from './utils'
import { queryString, getClassById } from './index'
import { $t } from 'src/locale'
import { filterLoginData } from './pureUtils'

export async function getWebs() {
  if (isSelfDevelop) {
    return
  }
  function finish(dbData: any) {
    dbData.forEach((item: any) => {
      websiteList.push(item)
    })
    event.emit('WEB_FINISH')
    window.__FINISHED__ = true
  }
  let data = filterLoginData(websiteList, isLogin)
  websiteList.splice(0, websiteList.length)
  if (!isLogin) {
    return finish(data)
  }
  const storageDate = window.localStorage.getItem(STORAGE_KEY_MAP.DATE_TIME)

  // 检测到网站更新，清除缓存本地保存记录失效
  if (storageDate !== navConfig.datetime) {
    const removeKeys = [STORAGE_KEY_MAP.WEBSITE, STORAGE_KEY_MAP.DATE_TIME]
    Array.from({ length: globalThis.localStorage.length }, (_, i) => {
      const key = globalThis.localStorage.key(i)
      if (key && removeKeys.includes(key)) {
        globalThis.localStorage.removeItem(key)
      }
    })
    globalThis.localStorage.setItem(
      STORAGE_KEY_MAP.DATE_TIME,
      navConfig.datetime
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
    const dbData: any =
      (await localforage.getItem(STORAGE_KEY_MAP.WEBSITE)) || data
    finish(dbData)
  } catch {
    finish(data)
  }
}

export function setWebsiteList(v?: INavProps[]): Promise<any> {
  v = v || websiteList
  if (isSelfDevelop) {
    return updateFileContent({
      content: JSON.stringify(v),
      path: DB_PATH,
    })
  }
  return localforage.setItem(STORAGE_KEY_MAP.WEBSITE, v)
}

export function toggleCollapseAll(wsList?: INavProps[]): boolean {
  wsList ||= websiteList
  const { id } = queryString()
  const { oneIndex, twoIndex } = getClassById(id)
  const collapsed = !wsList[oneIndex].nav[twoIndex].collapsed
  wsList[oneIndex].nav[twoIndex].collapsed = collapsed
  wsList[oneIndex].nav[twoIndex].nav.map((item) => {
    item.collapsed = collapsed
    return item
  })
  if (!isSelfDevelop) {
    setWebsiteList(wsList)
  }
  return collapsed
}

export async function deleteWebByIds(
  ids: number[],
  isDelRid = false
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

  f(websiteList)
  if (hasDelete) {
    await setWebsiteList(websiteList)
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

  f(websiteList)
  setWebsiteList(websiteList)
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
  f(websiteList)
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

  f(websiteList)
  setWebsiteList(websiteList)
  return ok
}

export async function deleteClassByIds(
  ids: number[],
  isDelRid = false
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

  // 删除一级分类
  ids.forEach((id) => {
    websiteList.forEach((item, index) => {
      if (item.id === id) {
        hasDelete = true
        websiteList.splice(index, 1)
      }
    })
  })

  f(websiteList)
  if (hasDelete) {
    await setWebsiteList(websiteList)
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

  f(websiteList)
  setWebsiteList(websiteList)
  return ok
}
