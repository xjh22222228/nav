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

function adapterWebsiteList(websiteList: any[]) {
  function filterOwn(item: IWebProps) {
    if (item.ownVisible && !isLogin) {
      return false
    }
    return true
  }
  websiteList = websiteList.filter(filterOwn)
  for (let i = 0; i < websiteList.length; i++) {
    const item = websiteList[i]

    if (Array.isArray(item.nav)) {
      item.nav = item.nav.filter(filterOwn)
      adapterWebsiteList(item.nav)
    }
  }

  return websiteList
}

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
  let data = adapterWebsiteList(websiteList)
  websiteList.splice(0, websiteList.length)
  if (!isLogin) {
    return finish(data)
  }
  const storageDate = window.localStorage.getItem(STORAGE_KEY_MAP.s_url)

  // 检测到网站更新，清除缓存本地保存记录失效
  if (storageDate !== navConfig.datetime) {
    const whiteList = [
      STORAGE_KEY_MAP.token,
      STORAGE_KEY_MAP.isDark,
      STORAGE_KEY_MAP.authCode,
      STORAGE_KEY_MAP.location,
    ]
    const len = window.localStorage.length
    for (let i = 0; i < len; i++) {
      const key = window.localStorage.key(i) as string
      if (whiteList.includes(key)) {
        continue
      }
      window.localStorage.removeItem(key)
    }
    window.localStorage.setItem(STORAGE_KEY_MAP.s_url, navConfig.datetime)
    localforage.removeItem(STORAGE_KEY_MAP.website)
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
      (await localforage.getItem(STORAGE_KEY_MAP.website)) || data
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
  return localforage.setItem(STORAGE_KEY_MAP.website, v)
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
  isSame = false
): Promise<boolean> {
  let hasDelete = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (Array.isArray(item.nav)) {
        item.nav = item.nav.filter((w: IWebProps) => {
          if (w.name) {
            if (ids.includes(isSame ? (w.rId as number) : w.id)) {
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
  isSame = false
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
            if (ids.includes(isSame ? (w['rId'] as number) : w.id)) {
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

export function pushDataByAny(id: number, data: any) {
  let ok = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.title) {
        if (item.id === id) {
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
