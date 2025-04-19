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
import { SELF_SYMBOL, DEFAULT_SORT_INDEX } from '../src/constants/symbol'
import {
  replaceJsdelivrCDN,
  removeTrailingSlashes,
  isNumber,
} from '../src/utils/pureUtils'
import fs from 'node:fs'
import yaml from 'js-yaml'

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
  serverdb: path.resolve('data', 'serverdb.json'),
  settings: path.resolve('data', 'settings.json'),
  tag: path.resolve('data', 'tag.json'),
  search: path.resolve('data', 'search.json'),
  collect: path.resolve('data', 'collect.json'),
  component: path.resolve('data', 'component.json'),
  internal: path.resolve('data', 'internal.json'),
  config: path.resolve('nav.config.yaml'),
  configJson: path.resolve('nav.config.json'),
  pkg: path.resolve('package.json'),
  html: {
    index: path.resolve('dist', 'browser', 'index.html'),
    main: path.resolve('src', 'main.html'),
    write: path.resolve('src', 'index.html'),
  },
} as const

export const getConfig = () => {
  const pkgJson = JSON.parse(fs.readFileSync(PATHS.pkg).toString())
  const config = yaml.load(fs.readFileSync(PATHS.config).toString()) as Record<
    string,
    any
  >

  const gitRepoUrl = removeTrailingSlashes(config['gitRepoUrl'] || '').replace(
    /\.git$/,
    ''
  )

  const zorroVersion = pkgJson.dependencies['ng-zorro-antd'].replace(
    /[^0-9.]/g,
    ''
  )
  return {
    version: pkgJson.version,
    zorroDark: `//gcore.jsdelivr.net/npm/ng-zorro-antd@${zorroVersion}/ng-zorro-antd.dark.min.css`,
    gitRepoUrl,
    imageRepoUrl: config['imageRepoUrl'],
    branch: config['branch'],
    hashMode: config['hashMode'],
    address: config['address'],
    email: config['email'],
    port: config['port'],
    datetime: dayjs.tz().format('YYYY-MM-DD HH:mm'),
  } as const
}

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

  const tagMap = new Map<number, ITagPropValues>()
  for (const tag of tags) {
    if (tag.id) {
      tagMap.set(tag.id, tag)
    }
  }

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
              for (let l = 0; l < navItemItem.nav.length; l++) {
                const webItem = navItemItem.nav[l] as IWebProps
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
                if (webItem.img) {
                  webItem.img = replaceJsdelivrCDN(webItem.img, settings)
                }
                webItem.url = removeTrailingSlashes(webItem.url.trim())
                webItem.name = webItem.name.trim().replace(/<b>|<\/b>/g, '')
                webItem.desc = webItem.desc.trim().replace(/<b>|<\/b>/g, '')

                // 网站标签和系统标签关联
                webItem.tags = webItem.tags.filter((item) => {
                  return tagMap.has(Number(item.id))
                })

                delete webItem.__desc__
                delete webItem.__name__
                delete webItem['extra']
                delete webItem['createdAt']
                delete webItem.breadcrumb
                if (webItem.tags.length === 0) {
                  delete webItem.tags
                }
                if (!webItem.top) {
                  delete webItem.top
                  delete webItem.topTypes
                }
                !webItem.ownVisible && delete webItem.ownVisible
                webItem.index === '' && delete webItem.index
                ;(webItem.topTypes ?? []).length === 0 &&
                  delete webItem.topTypes
              }

              navItemItem.nav.sort((a: any, b: any) => {
                const aIndexs = []
                if (isNumber(a.index)) {
                  aIndexs.push(Number(a.index))
                } else {
                  for (const tag of a.tags || []) {
                    const tagItem = tagMap.get(Number(tag.id))
                    if (tagItem?.sort != null) {
                      aIndexs.push(Number(tagItem.sort))
                    }
                  }
                  if (aIndexs.length === 0) {
                    aIndexs.push(DEFAULT_SORT_INDEX)
                  }
                }

                const aIdx = Math.min(...aIndexs)
                const bIndexs = []
                if (isNumber(b.index)) {
                  bIndexs.push(Number(b.index))
                } else {
                  for (const tag of b.tags || []) {
                    const tagItem = tagMap.get(Number(tag.id))
                    if (tagItem?.sort != null) {
                      bIndexs.push(Number(tagItem.sort))
                    }
                  }
                  if (bIndexs.length === 0) {
                    bIndexs.push(DEFAULT_SORT_INDEX)
                  }
                }

                const bIdx = Math.min(...bIndexs)
                return aIdx - bIdx
              })
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
  <link rel="prefetch" href="${getConfig().zorroDark}" />
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

function updateItemField(
  item: IWebProps,
  field: keyof IWebProps,
  value: string | undefined,
  settingKey: keyof ISettings,
  settings: ISettings,
  logMessage: string
): string {
  if (settings[settingKey] === 'ALWAYS' && value) {
    const message = `更新${logMessage}：${correctURL(item.url)}: "${
      item[field]
    }" => "${value}"`

    console.log(message)
    item[field] = value
    return message
  } else if (settings[settingKey] === 'EMPTY' && !item[field] && value) {
    const message = `更新${logMessage}：${correctURL(item.url)}: "${
      item[field]
    }" => "${value}"`
    console.log(message)
    item[field] = value
    return message
  }
  return ''
}

export async function spiderWebs(
  db: INavProps[],
  settings: ISettings,
  props?: {
    onOk?: (messages: string[]) => void
  }
): Promise<SpiderWebResult> {
  let errorUrlCount = 0
  const { onOk } = props || {}
  const items: IWebProps[] = []

  const collectItems = (nav: any[]) => {
    if (!Array.isArray(nav)) return

    for (const item of nav) {
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
        collectItems(item.nav)
      }
    }
  }

  collectItems(db)

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
    const requestPromises = items
      .slice(current * max, current * max + max)
      .map((item) =>
        getWebInfo(correctURL(item.url), {
          timeout: settings.spiderTimeout * 1000,
        })
      )

    const promises = await Promise.all(requestPromises)
    let messages = []
    for (let i = 0; i < promises.length; i++) {
      const idx = current * max + i
      const item = items[idx]
      const res = promises[i] as WebInfoResponse

      const message = `${idx}：${
        res.status ? '正常' : `疑似异常: ${res.errorMsg}`
      } ${correctURL(item.url)}`

      console.log(message)
      messages.push(message)

      if (settings.checkUrl && !res.status) {
        errorUrlCount += 1
        item.ok = false
      }

      if (res?.status) {
        messages.push(
          updateItemField(
            item,
            'icon',
            res.iconUrl,
            'spiderIcon',
            settings,
            '图标'
          ),
          updateItemField(
            item,
            'name',
            res.title,
            'spiderTitle',
            settings,
            '标题'
          ),
          updateItemField(
            item,
            'desc',
            res.description,
            'spiderDescription',
            settings,
            '描述'
          )
        )
      }
      console.log('-'.repeat(100))
    }
    messages = messages.filter(Boolean)
    if (messages) {
      onOk?.(messages)
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

export async function fileWriteStream(path: string, data: object | string) {
  const strings = typeof data === 'string' ? data : JSON.stringify(data)
  const CHUNK_SIZE = 1024 * 1024
  const stream1 = fs.createWriteStream(path)

  const stream1Promise = new Promise((resolve, reject) => {
    stream1.on('finish', () => resolve('file1 written'))
    stream1.on('error', (err) => reject(err))
  })

  const writeChunks = (stream: fs.WriteStream, data: string) => {
    return new Promise<void>((resolve, reject) => {
      const totalLength = data.length
      let position = 0

      const writeNextChunk = () => {
        if (position >= totalLength) {
          stream.end()
          resolve()
          return
        }

        // 计算当前块的结束位置
        const end = Math.min(position + CHUNK_SIZE, totalLength)
        // 提取当前块
        const chunk = data.slice(position, end)

        // 写入当前块
        const canContinue = stream.write(chunk, 'utf8')
        position = end

        // 如果流已满，等待'drain'事件后继续
        if (!canContinue) {
          stream.once('drain', writeNextChunk)
        } else {
          // 使用setImmediate避免调用栈溢出
          setImmediate(writeNextChunk)
        }
      }

      writeNextChunk()

      stream.on('error', (err) => {
        reject(err)
      })
    })
  }

  try {
    await writeChunks(stream1, strings)
    const results = await stream1Promise
    return results
  } catch (err) {
    stream1.end()
    console.log(`Failed to write files: ${(err as Error).message}`)
    return err
  }
}

export function fileReadStream(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path)
    let chunks: any[] = []

    stream.on('data', (chunk) => {
      chunks.push(chunk)
    })

    stream.on('end', () => {
      const fullContent = Buffer.concat(chunks)
      const data = fullContent.toString('utf8')
      resolve(data)
    })

    stream.on('error', (err) => {
      reject(err)
      console.error('Error:', err)
    })
  })
}
