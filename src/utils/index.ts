// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import qs from 'qs'
import Clipboard from 'clipboard'
import {
  IWebProps,
  INavThreeProp,
  INavProps,
  ISearchEngineProps,
  IWebTag,
} from '../types'
import { STORAGE_KEY_MAP } from 'src/constants'
import { isLogin } from './user'
import { SearchType } from 'src/components/search-engine/index'
import { websiteList, searchEngineList, settings } from 'src/store'
import { $t } from 'src/locale'

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

      if (item.name) {
        item.name = getTextContent(item.name)
        item.desc = getTextContent(item.desc)
        const name = item.name.toLowerCase()
        const desc = item.desc.toLowerCase()
        const url = item.url.toLowerCase()
        const search = keyword.toLowerCase()

        const searchTitle = (): boolean => {
          if (name.includes(search)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, '<b>$1</b>')

            if (!urlRecordMap[result.id]) {
              urlRecordMap[result.id] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchUrl = (): any => {
          if (url?.includes?.(search)) {
            if (!urlRecordMap[item.id]) {
              urlRecordMap[item.id] = true
              navData.push(item)
              return true
            }
          }

          const find = item.tags.some((item: IWebTag) =>
            item.url?.includes(keyword)
          )
          if (find) {
            if (!urlRecordMap[item.id]) {
              urlRecordMap[item.id] = true
              navData.push(item)
              return true
            }
          }
        }

        const searchDesc = (): boolean => {
          if (desc[0] === '!') {
            return false
          }
          if (desc.includes(search)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__desc__ = result.desc
            result.desc = result.desc.replace(regex, '<b>$1</b>')

            if (!urlRecordMap[result.id]) {
              urlRecordMap[result.id] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchQuick = (): boolean => {
          if (item.top && name.includes(search)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, '<b>$1</b>')

            if (!urlRecordMap[result.id]) {
              urlRecordMap[result.id] = true
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

            case SearchType.Quick:
              searchQuick()
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
      const local = JSON.parse(engine)
      const findItem = searchEngineList.find((item) => item.name === local.name)
      if (findItem) {
        DEFAULT = findItem
      }
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

// value 可能含有标签元素，用于过滤掉标签获取纯文字
export function getTextContent(value: string): string {
  if (!value) return ''
  return value.replace(/<b>|<\/b>/g, '')
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

export function addZero(n: number): string {
  return n < 10 ? `0${n}` : String(n)
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

export function isMobile() {
  return 'ontouchstart' in window
}

// 今年第几天
export function getDayOfYear() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  // @ts-ignore
  const diff = now - startOfYear
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

export function getDateTime() {
  const weeks = $t('_weeks')
  const now = new Date()
  const year = now.getFullYear()
  const hours = addZero(now.getHours())
  const minutes = addZero(now.getMinutes())
  const seconds = addZero(now.getSeconds())
  const month = now.getMonth() + 1
  const date = now.getDate()
  const day = now.getDay()
  const zeroDate = addZero(date)
  return {
    year,
    hours,
    minutes,
    seconds,
    month,
    date,
    zeroDate,
    dayText: weeks[day],
  } as const
}

export function getDefaultTheme() {
  const t = isMobile() ? settings.appTheme : settings.theme
  if (t === 'Current') {
    return settings.theme
  }
  return t
}
