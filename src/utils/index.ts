// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import qs from 'qs'
import Clipboard from 'clipboard'
import {
  INavFourProp, INavThreeProp, INavProps,
  ISearchEngineProps
} from '../types'
import * as db from '../../data/db.json'
import * as s from '../../data/search.json'
import { STORAGE_KEY_MAP } from '../constants'
import { isLogin } from './user'
import { SearchType } from '../components/search-engine/index'

export const websiteList: INavProps[] = getWebsiteList()

let total = 0
const searchEngineList: ISearchEngineProps[] = (s as any).default

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function fuzzySearch(navList: INavProps[], keyword: string): INavThreeProp[] {
  const { type, page, id } = queryString()
  const sType = Number(type) || SearchType.Title
  const navData = []
  const resultList = [{ nav: navData }]
  const urlRecordMap = {}

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
        const urls = Object.values(item.urls || {})

        function searchTitle(): boolean {
          if (name.includes(search)) {
            let result = { ...item }
            const regex = new RegExp(`(${keyword})`, 'i')
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

export function totalWeb(): number {
  if (total) {
    return total
  }

  function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.url && (isLogin || !item.ownVisible)) {
        total += 1
      } else {
        r(item.nav)
      }
    }
  }
  r(websiteList)

  return total
}

function randomColor(): string {
  const r = randomInt(255)
  const g = randomInt(255)
  const b = randomInt(255)
  const c = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}000`
  return c.slice(0, 7)
}

let randomTimer
export function randomBgImg() {
  if (isDark()) return

  clearInterval(randomTimer)

  const el = document.createElement('div')
  const deg = randomInt(360)
  el.id = 'random-light-bg'
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-3;transition: 1s linear;'
  el.style.backgroundImage =
    `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
  document.body.appendChild(el)

  function setBg() {
    const randomBg =
    `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
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
  id: number,
  page: number
  [key: string]: any
} {
  const { href } = window.location
  const search = href.split('?')[1] || ''
  const parseQs = qs.parse(search)
  let id = parseInt(parseQs.id) || 0
  let page = parseInt(parseQs.page) || 0

  if (parseQs.id === undefined && parseQs.page === undefined) {
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
    page = websiteList.length - 1;
    id = 0;
  } else {
    if (!(id <= websiteList[page].nav.length - 1)) {
      id = websiteList[page].nav.length - 1;
    }
  }

  return {
    ...parseQs,
    q: parseQs.q || '',
    id,
    page,
  }
}

export function adapterWebsiteList(websiteList: any[], parentItem?: any) {
  const createdAt = new Date().toISOString()

  for (let i = 0; i < websiteList.length; i++) {
    const item = websiteList[i]
    item.createdAt ||= createdAt

    if (Array.isArray(item.nav)) {
      adapterWebsiteList(item.nav, item)
    }

    // Four
    if (item.url) {
      if (!item.icon && parentItem?.icon) {
        item.icon = parentItem.icon
      }

      item.urls ||= {}
      item.rate ??= 5
      item.top ??= false
    }
  }

  return websiteList;
}

export function getWebsiteList(): INavProps[] {
  let webSiteList = adapterWebsiteList((db as any).default)
  const scriptElAll = document.querySelectorAll('script')
  const scriptUrl = scriptElAll[scriptElAll.length - 1].src
  const storageScriptUrl = window.localStorage.getItem(STORAGE_KEY_MAP.s_url)

  // 检测到网站更新，清除缓存
  if (storageScriptUrl !== scriptUrl) {
    const whiteList = [STORAGE_KEY_MAP.token, STORAGE_KEY_MAP.isDark]
    const len = window.localStorage.length
    for (let i = 0; i < len; i++) {
      const key = window.localStorage.key(i)
      if (whiteList.includes(key)) {
        continue
      }
      window.localStorage.removeItem(key)
    }
    window.localStorage.setItem(STORAGE_KEY_MAP.s_url, scriptUrl)
    return webSiteList
  }

  try {
    const w = window.localStorage.getItem(STORAGE_KEY_MAP.website)
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

  wsList[page].nav[id].nav.map(item => {
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
      id
    }
  ))
}

export function getDefaultSearchEngine(): ISearchEngineProps {
  let DEFAULT = (searchEngineList[0] || {}) as ISearchEngineProps
  try {
    const engine = window.localStorage.getItem(STORAGE_KEY_MAP.engine);
    if (engine) {
      DEFAULT = JSON.parse(engine)
    }
  } catch {}
  return DEFAULT
}

export function setDefaultSearchEngine(engine: ISearchEngineProps) {
  window.localStorage.setItem(
    STORAGE_KEY_MAP.engine,
    JSON.stringify(engine)
  )
}

export function isDark(): boolean {
  const storageVal = window.localStorage.getItem(STORAGE_KEY_MAP.isDark)
  const darkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches

  if (!storageVal && darkMode) {
    return darkMode
  }

  return Boolean(Number(storageVal))
}

export async function getLogoUrl(url: string): Promise<boolean|string> {
  try {
    const c = ['/favicon.png', '/favicon.svg', '/favicon.jpg', '/favicon.ico', '/logo.png']
    const { origin } = new URL(url)

    const promises = c.map(url => {
      const iconUrl = origin + url
      return new Promise(resolve => {
        try {
          const img = document.createElement('img')
          img.src = iconUrl
          img.style.display = 'none'
          img.onload = () => {
            img.parentNode.removeChild(img)
            resolve(iconUrl)
          }
          img.onerror = () => {
            img.parentNode.removeChild(img)
            resolve(false)
          }
          document.body.append(img)
        } catch (error) {
          resolve(false)
        }
      }) 
    })

    const all = await Promise.all<any>(promises)
    for (let i = 0; i < all.length; i++) {
      if (all[i]) {
        return all[i]
      }
    }
    
  } catch {
    return null
  }
}

export function copyText(el: Event, text: string): Promise<boolean> {
  const target = el.target as Element
  const ranId = `copy-${Date.now()}`
  target.id = ranId
  target.setAttribute('data-clipboard-text', text)

  return new Promise(resolve => {
    const clipboard = new Clipboard(`#${ranId}`)
    clipboard.on('success', function() {
      clipboard.destroy()
      resolve(true)
    });
  
    clipboard.on('error', function() {
      clipboard.destroy()
      resolve(false)
    });
  })
}

export async function isValidImg(url: string): Promise<boolean> {
  if (!url) return false

  if (url === 'null' || url === 'undefined') return false

  const { protocol } = window.location

  if (protocol === 'https:' && url.startsWith('http:')) return false

  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = url
    img.style.display = 'none'
    img.onload = () => {
      img.parentNode.removeChild(img)
      resolve(true)
    }
    img.onerror = () => {
      img.parentNode.removeChild(img)
      resolve(false)
    }
    document.body.append(img)
  })
}

export function deleteByWeb(data: INavFourProp) {
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.name) {
        if (
          item.name === data.name &&
          item.desc === data.desc &&
          item.top === data.top &&
          item.createdAt === data.createdAt
        ) {
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

export function updateByWeb(prevData: INavFourProp, nextData: INavFourProp) {
  const keys = Object.keys(nextData)

  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.name) {
        if (
          item.name === prevData.name &&
          item.desc === prevData.desc &&
          item.top === prevData.top &&
          item.createdAt === prevData.createdAt
        ) {
          for (let k of keys) {
            item[k] = nextData[k]
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
}

export function getTextContent(value: string): string {
  if (!value) return ''
  const div = document.createElement('div')
  div.innerHTML = value
  return div.textContent
}

export function matchCurrentList(): INavThreeProp[] {
  const { id, page } = queryString()
  let data = []

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
