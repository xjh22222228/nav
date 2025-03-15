// Copyright @ 2018-present xie.jiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import dayjs from 'dayjs'
import LOAD_MAP from './loading'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import getWebInfo from 'info-web'
import path from 'node:path'
import type {
  INavProps,
  ISettings,
  ITagPropValues,
  IWebProps,
} from '../src/types'
import { SELF_SYMBOL } from '../src/constants/symbol'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

export const TAG_ID1 = -1
export const TAG_ID2 = -2
export const TAG_ID3 = -3
export const TAG_ID_NAME1 = '中文'
export const TAG_ID_NAME2 = '英文'
export const TAG_ID_NAME3 = 'GitHub'

export const PATHS = {
  upload: path.resolve('_upload', 'images'),
  db: path.resolve('data', 'db.json'),
  settings: path.resolve('data', 'settings.json'),
  tag: path.resolve('data', 'tag.json'),
  search: path.resolve('data', 'search.json'),
  collect: path.resolve('data', 'collect.json'),
  component: path.resolve('data', 'component.json'),
  internal: path.resolve('data', 'internal.json'),
  config: path.resolve('nav.config.yaml'),
  pkg: path.resolve('package.json'),
  html: {
    index: path.resolve('dist', 'browser', 'index.html'),
    main: path.resolve('src', 'main.html'),
    write: path.resolve('src', 'index.html'),
  },
} as const

interface WebCountResult {
  userViewCount: number
  loginViewCount: number
}

// 统计网站数量
export function getWebCount(websiteList: INavProps[]): WebCountResult {
  // 用户查看所有数量
  let userViewCount = 0
  // 登陆者统计所有数量
  let loginViewCount = 0
  let diffCount = 0

  function r(nav: any[]): void {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.url) {
        loginViewCount += 1
        userViewCount += 1
      } else {
        r(item.nav)
      }
    }
  }

  function r2(nav: any[], ownVisible?: boolean): void {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.ownVisible) {
        r2(item.nav, true)
      } else {
        r2(item.nav, ownVisible)
      }

      if (item.url && item.ownVisible && !ownVisible) {
        diffCount += 1
      } else if (item.url && ownVisible) {
        diffCount += 1
      }
    }
  }

  r(websiteList)
  r2(websiteList)

  return {
    userViewCount: userViewCount - diffCount,
    loginViewCount,
  }
}

let maxWebId = 0
let maxClassId = 0
let maxWebRid = 0

function getMaxWebId(nav: any[]): void {
  function f(nav: any[]): void {
    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.name && item.id > maxWebId) {
        maxWebId = item.id
      }
      if (item.rId && item.rId > maxWebRid) {
        maxWebRid = item.rId
      }
      if (item.title && item.id > maxClassId) {
        maxClassId = item.id
      }
      if (item.nav) {
        f(item.nav)
      }
    }
  }
  f(nav)
}

function incrementWebId(id: number | string): number {
  id = Number.parseInt(id as string)
  if (!id || id < 0) {
    return ++maxWebId
  }
  return id
}

function incrementWebRId(id: number | string): number {
  id = Number.parseInt(id as string)
  if (id < 0) {
    return ++maxWebRid
  }
  return id
}

function incrementClassId(id: number | string): number {
  id = Number.parseInt(id as string)
  if (!id || id < 0) {
    return ++maxClassId
  }
  return id
}

export function setWebs(
  nav: INavProps[],
  settings: ISettings,
  tags: ITagPropValues[] = []
): INavProps[] {
  if (!Array.isArray(nav)) return []

  function handleAdapter(item: any): void {
    delete item.collapsed
    delete item.createdAt
    if (!item.ownVisible) {
      delete item.ownVisible
    }
    item.id = incrementClassId(item.id)
    if (item.rId < 0) {
      item.rId = incrementWebRId(item.rId)
    }
    item.icon = replaceJsdelivrCDN(item.icon, settings)
    item.nav ||= []
  }

  getMaxWebId(nav)

  for (let i = 0; i < nav.length; i++) {
    const item = nav[i]
    handleAdapter(item)
    if (item.nav) {
      for (let j = 0; j < item.nav.length; j++) {
        const navItem = item.nav[j]
        handleAdapter(navItem)
        if (navItem.nav) {
          for (let k = 0; k < navItem.nav.length; k++) {
            const navItemItem = navItem.nav[k]
            handleAdapter(navItemItem)

            if (navItemItem.nav) {
              navItemItem.nav.sort((a: any, b: any) => {
                const aIdx =
                  a.index == null || a.index === '' ? 100000 : Number(a.index)
                const bIdx =
                  b.index == null || b.index === '' ? 100000 : Number(b.index)
                return aIdx - bIdx
              })
              for (let l = 0; l < navItemItem.nav.length; l++) {
                let breadcrumb: string[] = []
                const webItem = navItemItem.nav[l] as IWebProps
                breadcrumb.push(item.title, navItem.title, navItemItem.title)
                breadcrumb = breadcrumb.filter(Boolean)
                webItem.breadcrumb = breadcrumb
                webItem.id = incrementWebId(webItem.id)
                if (webItem.rId) {
                  webItem.rId = incrementWebRId(webItem.rId)
                }
                webItem.tags ||= []
                webItem.rate ??= 5
                webItem.top ??= false
                webItem.ownVisible ??= false
                webItem.url ||= ''
                webItem.name ||= ''
                webItem.desc ||= ''
                webItem.icon ||= ''
                webItem.icon = replaceJsdelivrCDN(webItem.icon, settings)
                webItem.url = webItem.url.trim()
                if (webItem.url.endsWith('/')) {
                  webItem.url = webItem.url.slice(0, -1)
                }
                webItem.name = webItem.name.trim().replace(/<b>|<\/b>/g, '')
                webItem.desc = webItem.desc.trim().replace(/<b>|<\/b>/g, '')

                delete webItem.__desc__
                delete webItem.__name__
                delete webItem['extra']
                delete webItem['createdAt']

                // 节省空间
                !webItem.top && delete webItem.top
                !webItem.ownVisible && delete webItem.ownVisible
                webItem.index === '' && delete webItem.index
                ;(webItem.topTypes ?? []).length === 0 &&
                  delete webItem.topTypes

                // 网站标签和系统标签关联
                webItem.tags = webItem.tags.filter((item) => {
                  return tags.some((tag) => String(tag.id) === String(item.id))
                })
              }
            }
          }
        }
      }
    }
  }
  return nav
}

interface SEOPayload {
  settings: ISettings
}

export function writeSEO(webs: INavProps[], payload: SEOPayload): string {
  const { settings } = payload
  const nowDate = dayjs.tz().format('YYYY-MM-DD HH:mm:ss')
  let seoTemplate = `
<div data-url="https://github.com/xjh22222228/nav" data-server-time="${Date.now()}" data-a="x.i.e-jiahe" data-date="${nowDate}" id="META-NAV" style="z-index:-1;position:fixed;top:-10000vh;left:-10000vh;">
`

  function r(navList: any[]): void {
    for (let value of navList) {
      if (Array.isArray(value.nav)) {
        r(value.nav)
      }
      if (value.name) {
        seoTemplate += `<div>${value.name}</div>${
          value.desc ? `<p>${value.desc}</p>` : ''
        }`
      }
    }
  }

  if (settings.openSEO) {
    r(webs)
  }

  seoTemplate += '</div>'

  return seoTemplate
}

interface TemplateParams {
  html: string
  settings: ISettings
  seoTemplate: string
}

export function writeTemplate({
  html,
  settings,
  seoTemplate,
}: TemplateParams): string {
  function getLoadKey(): string {
    const keys = Object.keys(LOAD_MAP)
    const rand = Math.floor(Math.random() * keys.length)
    const loadingKey =
      settings.loading === 'random' ? keys[rand] : settings.loading
    return loadingKey
  }
  const htmlTemplate = `
  <!-- https://github.com/xjh22222228/nav -->
  <title>${settings.title}</title>
  <meta property="og:title" content="${settings.title}" />
  <meta property="og:description" content="${settings.description}" />
  <meta property="og:type" content="website" />
  <meta name="description" content="${settings.description}" />
  <meta name="keywords" content="${settings.keywords}" id="xjh_2" />
  <link rel="icon" href="${settings.favicon}" />
  <link rel ="apple-touch-icon" href="${settings.favicon}" />
  <link rel="prefetch" href="//unpkg.com/ng-zorro-antd@19.1.0/ng-zorro-antd.dark.min.css" />
`.trim()
  let t = html
  t = t.replace(
    /(<!-- nav\.config-start -->)(.|\s)*?(<!-- nav.config-end -->)/i,
    `$1${htmlTemplate}$3`
  )
  if (settings.headerContent) {
    t = t.replace(
      /(<!-- nav.headerContent-start -->)(.|\s)*?(<!-- nav.headerContent-end -->)/i,
      `$1${settings.headerContent}$3`
    )
  }

  t = t.replace(
    /(<!-- nav.seo-start -->)(.|\s)*?(<!-- nav.seo-end -->)/i,
    `$1${seoTemplate}$3`
  )

  const loadingCode = settings.loadingCode.trim()
  t = t.replace(
    /(<!-- nav.loading-start -->)(.|\s)*?(<!-- nav.loading-end -->)/i,
    `$1${loadingCode || LOAD_MAP[getLoadKey()] || ''}$3`
  )
  return t
}

function correctURL(url: string): string {
  if (url[0] === SELF_SYMBOL) {
    return url.slice(1)
  }
  return url
}

interface SpiderWebResult {
  webs: INavProps[]
  errorUrlCount: number
  time: number
}

interface WebInfoResponse {
  status: boolean
  errorMsg?: string
  iconUrl?: string
  title?: string
  description?: string
}

export async function spiderWeb(
  db: INavProps[],
  settings: ISettings
): Promise<SpiderWebResult> {
  let errorUrlCount = 0
  const items: IWebProps[] = []

  async function r(nav: any[]): Promise<void> {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.url && item.url[0] !== '!') {
        delete item.ok
        if (
          settings.checkUrl ||
          settings.spiderIcon === 'EMPTY' ||
          settings.spiderIcon === 'ALWAYS' ||
          settings.spiderDescription === 'EMPTY' ||
          settings.spiderDescription === 'ALWAYS' ||
          settings.spiderTitle === 'EMPTY' ||
          settings.spiderTitle === 'ALWAYS'
        ) {
          items.push(item)
        }
      } else {
        r(item.nav)
      }
    }
  }

  await r(db)

  const max = settings.spiderQty ?? 20
  const count = Math.ceil(items.length / max)
  let current = 0
  const now = Date.now()

  if (items.length) {
    console.log(
      `正在爬取信息... 并发数量：${max}  超时: ${settings.spiderTimeout}秒`
    )
  }

  while (current < count) {
    const requestPromises: Promise<any>[] = []
    for (let i = current * max; i < current * max + max; i++) {
      const item = items[i]
      if (item) {
        requestPromises.push(
          getWebInfo(correctURL(item.url), {
            timeout: settings.spiderTimeout * 1000,
          })
        )
      }
    }

    const promises = await Promise.all(requestPromises)

    for (let i = 0; i < promises.length; i++) {
      const idx = current * max + i
      const item = items[idx]
      const res = promises[i].value as WebInfoResponse
      console.log(
        `${idx}：${
          res.status ? '正常' : `疑似异常: ${res.errorMsg}`
        } ${correctURL(item.url)}`
      )
      if (settings.checkUrl) {
        if (!res.status) {
          errorUrlCount += 1
          item.ok = false
        }
      }
      if (res.status) {
        if (settings.spiderIcon === 'ALWAYS' && res.iconUrl) {
          item.icon = res.iconUrl
          console.log(
            `更新图标：${correctURL(item.url)}: "${item.icon}" => "${
              res.iconUrl
            }"`
          )
        } else if (
          settings.spiderIcon === 'EMPTY' &&
          !item.icon &&
          res.iconUrl
        ) {
          item.icon = res.iconUrl
          console.log(
            `更新图标：${correctURL(item.url)}: "${item.icon}" => "${
              res.iconUrl
            }"`
          )
        }

        if (settings.spiderTitle === 'ALWAYS' && res.title) {
          console.log(
            `更新标题：${correctURL(item.url)}: "${item['title']}" => "${
              res.title
            }"`
          )
          item.name = res.title
        } else if (
          settings.spiderTitle === 'EMPTY' &&
          !item.name &&
          res.title
        ) {
          console.log(
            `更新标题：${correctURL(item.url)}: "${item['title']}" => "${
              res.title
            }"`
          )
          item.name = res.title
        }

        if (settings.spiderDescription === 'ALWAYS' && res.description) {
          console.log(
            `更新描述：${correctURL(item.url)}: "${item.desc}" => "${
              res.description
            }"`
          )
          item.desc = res.description
        } else if (
          settings.spiderDescription === 'EMPTY' &&
          !item.desc &&
          res.description
        ) {
          console.log(
            `更新描述：${correctURL(item.url)}: "${item.desc}" => "${
              res.description
            }"`
          )
          item.desc = res.description
        }
      }
      console.log('-'.repeat(100))
    }
    current += 1
  }

  const diff = Math.ceil((Date.now() - now) / 1000)
  console.log(`OK: Time: ${diff} seconds`)

  return {
    webs: db,
    errorUrlCount,
    time: diff,
  }
}

export function replaceJsdelivrCDN(
  str: string = '',
  settings: ISettings
): string {
  const cdn = settings?.gitHubCDN
  if (!cdn) {
    return str
  }
  str = str.replace('cdn.jsdelivr.net', cdn)
  str = str.replace('testingcf.jsdelivr.net', cdn)
  str = str.replace('img.jsdmirror.com', cdn)
  str = str.replace('gcore.jsdelivr.net', cdn)
  return str
}
