// Copyright @ 2018-present xiejia.he. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import config from '../nav.config.js'
import path from 'path'
import LOAD_MAP from './loading.js'
import dayjs from 'dayjs'
import getWebInfo from 'info-web'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const dbPath = path.join('.', 'data', 'db.json')
const setPath = path.join('.', 'data', 'settings.json')
const pkgPath = path.join('package.json')

const db = JSON.parse(fs.readFileSync(dbPath).toString())
const pkg = JSON.parse(fs.readFileSync(pkgPath).toString())
const settings = JSON.parse(fs.readFileSync(setPath).toString())

const nowDate = dayjs.tz().format('YYYY-MM-DD HH:mm:ss')

const { description, title, keywords, loading, favicon, headerContent } =
  settings

const { gitRepoUrl, homeUrl } = config.default

const s = gitRepoUrl.split('/')

const authorName = s[s.length - 2]
const repoName = s[s.length - 1]

const htmlTemplate = `
  <!-- https://github.com/xjh22222228/nav -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}" id="xjh_2">
  <link rel="icon" href="${favicon}">
  <link rel ="apple-touch-icon" href="${favicon}">
`.trim()

let scriptTemplate = ``.trim()

let seoTemplate = `
<div data-url="https://github.com/xjh22222228/nav" data-server-time="${Date.now()}" data-a="x.i.e-jiahe" data-date="${nowDate}" data-version="${
  pkg.version
}" id="META-NAV" style="z-index:-1;position:fixed;top:-10000vh;left:-10000vh;">
`

async function buildSeo() {
  function r(navList) {
    for (let value of navList) {
      if (Array.isArray(value.nav)) {
        r(value.nav)
      }

      seoTemplate += `<h3>${value.title || value.name || title}</h3>${
        value.icon ? `<img data-src="${value.icon}" alt="${homeUrl}" />` : ''
      }<p>${value.desc || description}</p><a href="${
        value.url || homeUrl || gitRepoUrl
      }"></a>`

      if (value.urls && typeof value.urls === 'object') {
        for (let k in value.urls) {
          seoTemplate += `<a href="${
            value.urls[k] || homeUrl || gitRepoUrl
          }"></a>`
        }
      }
    }
  }

  if (settings.openSEO) {
    r(db)
  }

  seoTemplate += '</div>'
}

async function build() {
  const htmlPath = path.join('.', 'src', 'main.html')
  const writePath = path.join('.', 'src', 'index.html')
  let t = fs.readFileSync(htmlPath).toString()
  t = t.replace(/<title>.*<\/title>/i, '')
  t = t.replace('<link rel="icon" href="assets/logo.png" />', '')
  t = t.replace('<link rel="icon" href="assets/logo.png">', '')
  t = t.replace('<!-- nav.config -->', htmlTemplate)
  if (headerContent) {
    t = t.replace('<!-- nav.headerContent -->', headerContent)
  }

  t = t.replace('<!-- nav.script -->', scriptTemplate)

  t = t.replace('<!-- nav.seo -->', seoTemplate)

  const loadingCode = settings.loadingCode.trim()
  t = t.replace(
    '<!-- nav.loading -->',
    loadingCode || LOAD_MAP[getLoadKey()] || ''
  )

  fs.writeFileSync(writePath, t, { encoding: 'utf-8' })
  fs.unlinkSync('./nav.config.js')
}

buildSeo()
  .finally(() => build())
  .catch(console.error)

function getLoadKey() {
  const keys = Object.keys(LOAD_MAP)
  const rand = Math.floor(Math.random() * keys.length)
  const loadingKey = loading === 'random' ? keys[rand] : loading
  return loadingKey
}

// 检查链接

let errorUrlCount = 0
;(async function () {
  const items = []

  async function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.url) {
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

  r(db)

  console.log('Getting...')
  const max = settings.spiderQty ?? 20
  const count = Math.ceil(items.length / max)
  let current = 0
  const now = Date.now()

  while (current < count) {
    const request = []
    for (let i = current * max; i < current * max + max; i++) {
      const item = items[i]
      if (item) {
        request.push(getWebInfo(item.url, { timeout: 3000 }))
      }
    }

    const promises = await Promise.allSettled(request)

    for (let i = 0; i < promises.length; i++) {
      const idx = current * max + i
      const item = items[idx]
      const res = promises[i].value
      console.log(`${idx}：${res.status ? '正常' : '疑似异常'} ${item.url}`)
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
            `更新图标：${item.url}: "${item.icon}" => "${res.iconUrl}"`
          )
        } else if (
          settings.spiderIcon === 'EMPTY' &&
          !item.icon &&
          res.iconUrl
        ) {
          item.icon = res.iconUrl
          console.log(
            `更新图标：${item.url}: "${item.icon}" => "${res.iconUrl}"`
          )
        }

        if (settings.spiderTitle === 'ALWAYS' && res.title) {
          console.log(
            `更新标题：${item.url}: "${item.title}" => "${res.title}"`
          )
          item.name = res.title
        } else if (
          settings.spiderTitle === 'EMPTY' &&
          !item.name &&
          res.title
        ) {
          console.log(
            `更新标题：${item.url}: "${item.title}" => "${res.title}"`
          )
          item.name = res.title
        }

        if (settings.spiderDescription === 'ALWAYS' && res.description) {
          console.log(
            `更新描述：${item.url}: "${item.desc}" => "${res.description}"`
          )
          item.desc = res.description
        } else if (
          settings.spiderDescription === 'EMPTY' &&
          !item.desc &&
          res.description
        ) {
          console.log(
            `更新描述：${item.url}: "${item.desc}" => "${res.description}"`
          )
          item.desc = res.description
        }
      }
      console.log('-'.repeat(100))
    }
    current += 1
  }

  const diff = Math.ceil((Date.now() - now) / 1000)
  console.log(`Time: ${diff} seconds`)
})()

process.on('exit', () => {
  settings.errorUrlCount = errorUrlCount
  fs.writeFileSync(setPath, JSON.stringify(settings), { encoding: 'utf-8' })
  fs.writeFileSync(dbPath, JSON.stringify(db), { encoding: 'utf-8' })
  console.log('All success!')
})
