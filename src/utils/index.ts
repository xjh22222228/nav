import WEBSITE_LIST from '../../data'
import qs from 'qs'
import config from '../../nav.config'
import { INavProps, ISearchEngineProps } from '../types'

const { backgroundLinear, errorIconUrl, searchEngineList } = config

export function debounce(func, wait, immediate) {
  let timeout

  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)

    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function fuzzySearch(navList: INavProps[], keyword: string) {
  let searchResultList = [{ nav: [] }]

  function f(arr?: any[]) {
    arr = arr || navList

    for (let i = 0; i < arr.length; i++) {

      if (Array.isArray(arr[i].nav)) {
        f(arr[i].nav)
      }

      if (arr[i].name) {
        const name = arr[i].name.toLowerCase()
        const desc = arr[i].desc.toLowerCase()
        const search = keyword.toLowerCase()

        if (~name.indexOf(search) || ~desc.indexOf(search)) {
          try {
            let result = Object.assign({}, arr[i])
            const regex = new RegExp(`(${keyword})`, 'i')
            result.name = result.name.replace(regex, `$1`.bold())
            result.desc = result.desc.replace(regex, `$1`.bold())

            const idx = searchResultList[0].nav.findIndex(item => item.name === result.name)
            if (idx === -1) {
              searchResultList[0].nav.push(result)
            }
          } catch (err) {}
        }
      }
    }
  }

  f()

  return searchResultList
}

let total = 0
export function totalWeb(): number {
  if (total) {
    return total
  }

  function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      if (nav[i].url) {
        total += 1
      } else {
        r(nav[i].nav)
      }
    }
  }
  r(WEBSITE_LIST)

  return total
}

let randomTimer
export function randomBgImg() {
  if (isDark()) return

  clearInterval(randomTimer)

  const el = document.createElement('div')
  el.id = 'random-light-bg'
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-3;transition: 1s linear;'
  el.style.backgroundImage = backgroundLinear[randomInt(backgroundLinear.length)]
  document.body.appendChild(el)

  function setBg() {
    const randomBg = backgroundLinear[randomInt(backgroundLinear.length)]
    el.style.opacity = '.3'
    setTimeout(() => {
      el.style.backgroundImage = randomBg
      el.style.opacity = '1'
    }, 1000)
  }

  randomTimer = setInterval(setBg, 10000)
}

export function onImgError(e: any) {
  if (errorIconUrl) {
    e.target.src = errorIconUrl
  } else {
    const el = e.target
    el.parentNode.removeChild(el)
  }
}

export function queryString() {
  const { href } = window.location
  const search = href.slice(href.indexOf('?') + 1)
  const parseQs = qs.parse(search)
  let id = parseInt(parseQs.id) || 0
  let page = parseInt(parseQs.page) || 0

  if (parseQs.id === undefined && parseQs.page === undefined) {
    try {
      const location = window.localStorage.getItem('location')
      if (location) {
        return JSON.parse(location)
      }
    } catch {}
  }

  if (page > WEBSITE_LIST.length - 1) {
    page = WEBSITE_LIST.length - 1;
    id = 0;
  } else {
    page = page;
    if (id <= WEBSITE_LIST[page].nav.length - 1) {
      id = id;
    } else {
      id = WEBSITE_LIST[page].nav.length - 1;
    }
  }

  return {
    ...parseQs,
    q: parseQs.q || '',
    id,
    page
  }
}

export function getWebsiteList() {
  let webSiteList = WEBSITE_LIST
  const scriptElAll = document.querySelectorAll('script')
  const scriptUrl = scriptElAll[scriptElAll.length - 1].src
  const storageScriptUrl = window.localStorage.getItem('s_url')

  // 更新数据
  if (storageScriptUrl !== scriptUrl) {
    window.localStorage.clear()
    window.localStorage.setItem('s_url', scriptUrl)
    return webSiteList
  }

  try {
    const w = window.localStorage.getItem('website')
    const json = JSON.parse(w)
    if (Array.isArray(json)) {
      webSiteList = json
    }
  } catch {}

  return webSiteList
}

export function setWebsiteList(v?: INavProps[]) {
  v = v || WEBSITE_LIST

  window.localStorage.setItem('website', JSON.stringify(v))
}

export function toggleCollapseAll(websiteList?: INavProps[]): boolean {
  websiteList = websiteList || WEBSITE_LIST

  const { page, id } = queryString()
  const collapsed = !websiteList[page].nav[id].collapsed

  websiteList[page].nav[id].collapsed = collapsed

  websiteList[page].nav[id].nav.map(item => {
    item.collapsed = collapsed
    return item
  })

  setWebsiteList(websiteList)

  return collapsed
}

export function setLocation() {
  const { page, id } = queryString()

  window.localStorage.setItem('location', JSON.stringify({
    page,
    id
  }))
}

export function getDefaultSearchEngine(): ISearchEngineProps {
  let DEFAULT = (searchEngineList[0] || {}) as ISearchEngineProps
  try {
    const engine = window.localStorage.getItem('engine');
    if (engine) {
      DEFAULT = JSON.parse(engine)
    }
  } catch {}
  return DEFAULT
}

export function setDefaultSearchEngine(engine: ISearchEngineProps) {
  window.localStorage.setItem('engine', JSON.stringify(engine))
}

export function imgErrorInRemove(e) {
  const el = e.currentTarget;
  el?.parentNode?.removeChild?.(el)
}

export function isDark(): boolean {
  const storageVal = window.localStorage.getItem('IS_DARK')
  const darkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches

  if (!storageVal && darkMode) {
    return darkMode
  }

  return Boolean(Number(storageVal))
}
