// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import qs from 'qs'
import Clipboard from 'clipboard'
import {
  IWebProps,
  INavThreeProp,
  INavProps,
  ISearchProps,
  IWebTag,
} from '../types'
import { STORAGE_KEY_MAP } from 'src/constants'
import { CODE_SYMBOL } from 'src/constants/symbol'
import { isLogin } from './user'
import { SearchType } from 'src/components/search/index'
import { websiteList, searchEngineList, settings, tagMap } from 'src/store'
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
  keyword = keyword.toLowerCase()

  const { type, id } = queryString()
  const { oneIndex, twoIndex } = getClassById(id)
  const sType = Number(type) || SearchType.All
  const navData: IWebProps[] = []
  let resultList: INavThreeProp[] = [
    { nav: navData, id: -1, title: $t('_searchRes'), icon: '' },
  ]
  const urlRecordMap = new Map<number, boolean>()

  if (sType === SearchType.Class) {
    resultList = []
  }

  function f(arr?: any[]) {
    arr = arr || navList

    outerLoop: for (let i = 0; i < arr.length; i++) {
      const item = arr[i]

      if (sType === SearchType.Class && item.title) {
        if (item.nav[0]?.name && item.title.toLowerCase().includes(keyword)) {
          resultList.push(item)
          break
        }
      }

      if (Array.isArray(item.nav)) {
        f(item.nav)
      }

      if (item.name) {
        item.name = getTextContent(item.name)
        item.desc = getTextContent(item.desc)
        const name = item.name.toLowerCase()
        const desc = item.desc.toLowerCase()
        const url = item.url.toLowerCase()
        const isCode = desc[0] === CODE_SYMBOL
        if (isCode) {
          continue
        }

        const searchTitle = (): boolean => {
          if (name.includes(keyword)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, '<b>$1</b>')

            if (!urlRecordMap.has(result.id)) {
              urlRecordMap.set(result.id, true)
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchUrl = (): any => {
          if (url.includes(keyword)) {
            if (!urlRecordMap.has(item.id)) {
              urlRecordMap.set(item.id, true)
              navData.push(item)
              return true
            }
          }

          const find = item.tags.some((item: IWebTag) =>
            item.url?.includes(keyword)
          )
          if (find) {
            if (!urlRecordMap.has(item.id)) {
              urlRecordMap.set(item.id, true)
              navData.push(item)
              return true
            }
          }
        }

        const searchDesc = (): boolean => {
          if (desc.includes(keyword)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__desc__ = result.desc
            result.desc = result.desc.replace(regex, '<b>$1</b>')

            if (!urlRecordMap.has(result.id)) {
              urlRecordMap.set(result.id, true)
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchQuick = (): boolean => {
          if (item.top && name.includes(keyword)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, '<b>$1</b>')

            if (!urlRecordMap.has(result.id)) {
              urlRecordMap.set(result.id, true)
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchTags = () => {
          return item.tags.forEach((tag: IWebTag) => {
            if (tagMap[tag.id]?.name?.toLowerCase() === keyword) {
              if (!urlRecordMap.has(item.id)) {
                urlRecordMap.set(item.id, true)
                navData.push(item)
              }
            }
          })
        }

        const searchId = (): boolean => {
          if (item.id == keyword) {
            navData.push(item)
            return true
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

            case SearchType.Tag:
              searchTags()
              break

            case SearchType.Id:
              if (searchId()) {
                break outerLoop
              }
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
    f(navList[oneIndex].nav[twoIndex].nav)
  } else {
    f()
  }

  if (sType !== SearchType.Class && navData.length <= 0) {
    return []
  }
  return resultList
}

export function randomColor(): string {
  const randomValue = Math.floor(Math.random() * 0xffffff)
  const hexColor = randomValue.toString(16).padStart(6, '0')
  return `#${hexColor}`
}

let randomTimer: any
export function randomBgImg(): void {
  if (isDark()) return

  if (randomTimer) {
    clearInterval(randomTimer)
  }

  const id = 'random-light-bg'
  const el = document.getElementById(id) || document.createElement('div')
  const deg = randomInt(360)

  el.id = id
  el.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -3;
    transition: 1s linear;
  `

  el.style.backgroundImage = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
  document.body.appendChild(el)

  const setBg = (): void => {
    if (isDark()) {
      if (randomTimer) {
        clearInterval(randomTimer)
        randomTimer = null
      }
      return
    }

    const randomBg = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`

    el.style.opacity = '0.3'
    setTimeout(() => {
      el.style.backgroundImage = randomBg
      el.style.opacity = '1'
    }, 1000)
  }

  randomTimer = setInterval(setBg, 10000)
}

export function queryString() {
  const { href } = window.location
  const search = href.split('?')[1] || ''
  const parseQs = qs.parse(search)
  let id = parseQs['id']

  if (parseQs['id'] == null) {
    try {
      const location = window.localStorage.getItem(STORAGE_KEY_MAP.location)
      if (location) {
        const localLocation = JSON.parse(location)
        id = localLocation.id
      }
    } catch {}
  }

  return {
    ...parseQs,
    type: parseQs['type'],
    q: (parseQs['q'] || '') as string,
    id,
  } as const
}

export function setLocation() {
  const { id } = queryString()

  window.localStorage.setItem(
    STORAGE_KEY_MAP.location,
    JSON.stringify({
      id,
    })
  )
}

export function getDefaultSearchEngine(): ISearchProps {
  let DEFAULT = (searchEngineList[0] || {}) as ISearchProps
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

export function setDefaultSearchEngine(engine: ISearchProps) {
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
export function getTextContent(value: string = ''): string {
  if (!value) return ''
  return value.replace(/<b>|<\/b>/g, '')
}

export function matchCurrentList(): INavThreeProp[] {
  const { id } = queryString()
  const { oneIndex, twoIndex } = getClassById(id)
  let data: INavThreeProp[] = []

  try {
    if (
      websiteList[oneIndex] &&
      websiteList[oneIndex]?.nav?.length > 0 &&
      (isLogin || !websiteList[oneIndex].nav[twoIndex].ownVisible)
    ) {
      data = websiteList[oneIndex].nav[twoIndex].nav
    } else {
      data = []
    }
  } catch {
    data = []
  }

  return data
}

export function addZero(n: number): string {
  return String(n).padStart(2, '0')
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

export function getClassById(id: unknown, initValue = 0) {
  id = Number(id)
  let oneIndex = initValue
  let twoIndex = initValue
  let threeIndex = initValue
  const breadcrumb: string[] = []

  outerLoop: for (let i = 0; i < websiteList.length; i++) {
    const item = websiteList[i]
    if (item.title) {
      if (item.id === id) {
        oneIndex = i
        breadcrumb.push(item.title)
        break
      }
    }
    if (Array.isArray(item.nav)) {
      for (let j = 0; j < item.nav.length; j++) {
        const twoItem = item.nav[j]
        if (twoItem.title) {
          if (twoItem.id === id) {
            oneIndex = i
            twoIndex = j
            breadcrumb.push(item.title, twoItem.title)
            break outerLoop
          }
        }
        if (Array.isArray(twoItem.nav)) {
          for (let k = 0; k < twoItem.nav.length; k++) {
            const threeItem = twoItem.nav[k]
            if (threeItem.id === id) {
              oneIndex = i
              twoIndex = j
              threeIndex = k
              breadcrumb.push(item.title, twoItem.title, threeItem.title)
              break outerLoop
            }
          }
        }
      }
    }
  }
  return {
    oneIndex,
    twoIndex,
    threeIndex,
    breadcrumb,
  } as const
}
