import event from 'src/utils/mitt'
import localforage from 'localforage'
import { updateFileContent } from 'src/api'
import { isLogin } from './user'
import { IWebProps, INavProps } from '../types'
import { websiteList } from 'src/store'
import { STORAGE_KEY_MAP, DB_PATH } from 'src/constants'
import { isSelfDevelop } from './util'
import { queryString } from './index'

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

export async function fetchWeb() {
  if (isSelfDevelop) {
    return
  }
  let data = adapterWebsiteList(websiteList)
  websiteList.splice(0, websiteList.length)
  const metaEl = document.getElementById('META-NAV')
  const date = metaEl?.dataset?.['date'] || ''
  const storageDate = window.localStorage.getItem(STORAGE_KEY_MAP.s_url)

  // 检测到网站更新，清除缓存本地保存记录失效
  if (storageDate !== date) {
    const whiteList = [
      STORAGE_KEY_MAP.token,
      STORAGE_KEY_MAP.isDark,
      STORAGE_KEY_MAP.authCode,
    ]
    const len = window.localStorage.length
    for (let i = 0; i < len; i++) {
      const key = window.localStorage.key(i) as string
      if (whiteList.includes(key)) {
        continue
      }
      window.localStorage.removeItem(key)
    }
    window.localStorage.setItem(STORAGE_KEY_MAP.s_url, date)
    localforage.removeItem(STORAGE_KEY_MAP.website)
    data.forEach((item) => {
      websiteList.push(item)
    })
    event.emit('WEB_FINISH')
    window.__FINISHED__ = true
    if (isLogin) {
      setTimeout(() => {
        event.emit('NOTIFICATION', {
          type: 'success',
          title: `构建完成`,
          content: date,
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
    dbData.forEach((item: any) => {
      websiteList.push(item)
    })
    event.emit('WEB_FINISH')
    window.__FINISHED__ = true
  } catch {}
}

export function setWebsiteList(v?: INavProps[]) {
  v = v || websiteList
  if (isSelfDevelop) {
    updateFileContent({
      content: JSON.stringify(v),
      path: DB_PATH,
    })
    return
  }
  localforage.setItem(STORAGE_KEY_MAP.website, v)
}

export function toggleCollapseAll(wsList?: INavProps[]): boolean {
  wsList ||= websiteList
  const { page, id } = queryString()
  const collapsed = !wsList[page].nav[id].collapsed
  wsList[page].nav[id].collapsed = collapsed
  wsList[page].nav[id].nav.map((item) => {
    item.collapsed = collapsed
    return item
  })
  if (!isSelfDevelop) {
    setWebsiteList(wsList)
  }
  return collapsed
}

export function deleteByWeb(data: IWebProps) {
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.name) {
        if (item.id === data.id) {
          arr.splice(i, 1)
          const { q } = queryString()
          q && window.location.reload()
          break
        }
        continue
      }

      if (Array.isArray(item.nav)) {
        f(item.nav)
      }
    }
  }

  f(websiteList)
  setWebsiteList(websiteList)
}

export function updateByWeb(oldData: IWebProps, newData: IWebProps) {
  const keys = Object.keys(newData)
  let ok = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.name) {
        if (item.id === oldData.id) {
          ok = true
          for (let k of keys) {
            item[k] = newData[k]
          }
          break
        }
        continue
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
