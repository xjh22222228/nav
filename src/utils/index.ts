// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import qs from 'qs'
import Clipboard from 'clipboard'
import {
  IWebProps,
  INavThreeProp,
  INavProps,
  ISearchEngineProps,
} from '../types'
import * as db from '../../data/db.json'
import * as s from '../../data/search.json'
import { STORAGE_KEY_MAP } from 'src/constants'
import { isLogin } from './user'
import { SearchType } from 'src/components/search-engine/index'
import { getIconUrl } from 'src/services'

export const websiteList: INavProps[] = getWebsiteList()

const searchEngineList: ISearchEngineProps[] = (s as any).default

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function fuzzySearch(
  navList: INavProps[],
  keyword: string
): INavThreeProp[] {
  if (!keyword.trim()) {
    return []
  }

  const { type, page, id } = queryString()
  const sType = Number(type) || SearchType.Title
  const navData: IWebProps[] = []
  const resultList: INavThreeProp[] = [{ nav: navData }]
  const urlRecordMap: Record<string, any> = {}

  function f(arr?: any[]) {
    arr = arr || navList

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (Array.isArray(item.nav)) {
        f(item.nav)
      }

      if (navData.length > 50) break

      if (item.name) {
        const name = item.name.toLowerCase()
        const desc = item.desc.toLowerCase()
        const url = item.url.toLowerCase()
        const search = keyword.toLowerCase()
        const urls: string[] = Object.values(item.urls || {})

        function searchTitle(): boolean {
          if (name.includes(search)) {
            let result = { ...item }
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, `$1`.bold())

            if (!urlRecordMap[result.url]) {
              urlRecordMap[result.url] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        function searchUrl() {
          if (url?.includes?.(keyword.toLowerCase())) {
            if (!urlRecordMap[item.url]) {
              urlRecordMap[item.url] = true
              navData.push(item)
              return true
            }
          }

          const find = urls.some((item: string) => item.includes(keyword))
          if (find) {
            if (!urlRecordMap[item.url]) {
              urlRecordMap[item.url] = true
              navData.push(item)
              return true
            }
          }
        }

        function searchDesc(): boolean {
          if (desc.includes(search)) {
            let result = { ...item }
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__desc__ = result.desc
            result.desc = result.desc.replace(regex, `$1`.bold())

            if (!urlRecordMap[result.url]) {
              urlRecordMap[result.url] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        try {
          switch (sType) {
            case SearchType.Url:
              searchUrl()
              break

            case SearchType.Title:
              searchTitle()
              break

            case SearchType.Desc:
              searchDesc()
              break

            default:
              searchTitle()
              searchDesc()
              searchUrl()
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  if (sType === SearchType.Current) {
    f(navList[page].nav[id].nav)
  } else {
    f()
  }

  if (navData.length <= 0) {
    return []
  }

  return resultList
}

function randomColor(): string {
  const r = randomInt(255)
  const g = randomInt(255)
  const b = randomInt(255)
  const c = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}000`
  return c.slice(0, 7)
}

let randomTimer: any
export function randomBgImg() {
  if (isDark()) return

  clearInterval(randomTimer)
  const id = 'random-light-bg'
  const el = document.getElementById(id) || document.createElement('div')
  const deg = randomInt(360)
  el.id = id
  el.style.cssText =
    'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-3;transition: 1s linear;'
  el.style.backgroundImage = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
  document.body.appendChild(el)

  function setBg() {
    if (isDark()) {
      clearInterval(randomTimer)
      return
    }
    const randomBg = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
    el.style.opacity = '.3'
    setTimeout(() => {
      el.style.backgroundImage = randomBg
      el.style.opacity = '1'
    }, 1000)
  }

  randomTimer = setInterval(setBg, 10000)
}

export function queryString(): {
  q: string
  id: number
  page: number
  [key: string]: any
} {
  const { href } = window.location
  const search = href.split('?')[1] || ''
  const parseQs = qs.parse(search)
  let id = parseInt(parseQs['id'] as string) || 0
  let page = parseInt(parseQs['page'] as string) || 0

  if (parseQs['id'] === undefined && parseQs['page'] === undefined) {
    try {
      const location = window.localStorage.getItem(STORAGE_KEY_MAP.location)
      if (location) {
        const localLocation = JSON.parse(location)
        page = localLocation.page || 0
        id = localLocation.id || 0
      }
    } catch {}
  }

  if (page > websiteList.length - 1) {
    page = 0
    id = 0
  } else {
    if (websiteList[page] && !(id <= websiteList[page].nav.length - 1)) {
      id = websiteList[page].nav.length - 1
    }
  }

  page = page < 0 ? 0 : page
  id = id < 0 ? 0 : id

  return {
    ...parseQs,
    q: (parseQs['q'] || '') as string,
    id,
    page,
  }
}

export function adapterWebsiteList(websiteList: any[]) {
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

export function getWebsiteList(): INavProps[] {
  let webSiteList = adapterWebsiteList((db as any).default)
  const scriptElAll = document.querySelectorAll('script')
  const scriptUrl = scriptElAll[scriptElAll.length - 1].src
  const storageScriptUrl = window.localStorage.getItem(STORAGE_KEY_MAP.s_url)

  // 检测到网站更新，清除缓存本地保存记录失效
  if (storageScriptUrl !== scriptUrl) {
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
    window.localStorage.setItem(STORAGE_KEY_MAP.s_url, scriptUrl)
    return webSiteList
  }

  try {
    const w: any = window.localStorage.getItem(STORAGE_KEY_MAP.website)
    const json = JSON.parse(w)
    if (Array.isArray(json)) {
      webSiteList = json
    }
  } catch {}

  return webSiteList
}

export function setWebsiteList(v?: INavProps[]) {
  v = v || websiteList

  window.localStorage.setItem(STORAGE_KEY_MAP.website, JSON.stringify(v))
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

  setWebsiteList(wsList)

  return collapsed
}

export function setLocation() {
  const { page, id } = queryString()

  window.localStorage.setItem(
    STORAGE_KEY_MAP.location,
    JSON.stringify({
      page,
      id,
    })
  )
}

export function getDefaultSearchEngine(): ISearchEngineProps {
  let DEFAULT = (searchEngineList[0] || {}) as ISearchEngineProps
  try {
    const engine = window.localStorage.getItem(STORAGE_KEY_MAP.engine)
    if (engine) {
      DEFAULT = JSON.parse(engine)
    }
  } catch {}
  return DEFAULT
}

export function setDefaultSearchEngine(engine: ISearchEngineProps) {
  window.localStorage.setItem(STORAGE_KEY_MAP.engine, JSON.stringify(engine))
}

export function isDark(): boolean {
  const storageVal = window.localStorage.getItem(STORAGE_KEY_MAP.isDark)
  const darkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches

  if (!storageVal && darkMode) {
    return darkMode
  }

  return Boolean(Number(storageVal))
}

export async function getWebInfo(url: string): Promise<Record<string, any>> {
  try {
    const res = await getIconUrl(url)
    return {
      ...res.data,
    }
  } catch (error) {}
  return {
    status: false,
  }
}

export function copyText(el: Event, text: string): Promise<boolean> {
  const target = el.target as Element
  const ranId = `copy-${Date.now()}`
  target.id = ranId
  target.setAttribute('data-clipboard-text', text)

  return new Promise((resolve) => {
    const clipboard = new Clipboard(`#${ranId}`)
    clipboard.on('success', function () {
      clipboard.destroy()
      resolve(true)
    })

    clipboard.on('error', function () {
      clipboard.destroy()
      resolve(false)
    })
  })
}

export async function isValidImg(url: string): Promise<boolean> {
  if (!url) return false

  if (url === 'null' || url === 'undefined') return false

  const { protocol } = window.location

  if (protocol === 'https:' && url.startsWith('http:')) return false

  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.src = url
    img.style.display = 'none'
    img.onload = () => {
      img.parentNode?.removeChild(img)
      resolve(true)
    }
    img.onerror = () => {
      img.parentNode?.removeChild(img)
      resolve(false)
    }
    document.body.append(img)
  })
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

// value 可能含有标签元素，用于过滤掉标签获取纯文字
export function getTextContent(value: string): string {
  if (!value) return ''
  const div = document.createElement('div')
  div.innerHTML = value
  return div.textContent ?? ''
}

export function matchCurrentList(): INavThreeProp[] {
  const { id, page } = queryString()
  let data: INavThreeProp[] = []

  try {
    if (
      websiteList[page] &&
      websiteList[page]?.nav?.length > 0 &&
      (isLogin || !websiteList[page].nav[id].ownVisible)
    ) {
      data = websiteList[page].nav[id].nav
    } else {
      data = []
    }
  } catch {
    data = []
  }

  return data
}

export function addZero(n: number): string | number {
  return n < 10 ? `0${n}` : n
}

// 获取第几个元素超出父节点宽度
export function getOverIndex(selector: string): number {
  const els = document.querySelectorAll(selector)
  let overIndex = Number.MAX_SAFE_INTEGER
  if (els.length <= 0) {
    return overIndex
  }
  const parentEl = els[0].parentNode as HTMLElement
  const parentWidth = parentEl!.clientWidth as number
  let scrollWidth = 0
  for (let i = 0; i < els.length; i++) {
    const el = els[i]
    scrollWidth += el.clientWidth
    if (scrollWidth > parentWidth) {
      overIndex = i - 1
      break
    }
  }
  return overIndex
}
