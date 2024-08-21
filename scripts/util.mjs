// Copyright @ 2018-present x.iejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav
import dayjs from 'dayjs'
import LOAD_MAP from './loading.mjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import getWebInfo from 'info-web'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

export const TAG_ID1 = -1
export const TAG_ID2 = -2
export const TAG_ID3 = -3
const TAG_ID_NAME1 = '中文'
const TAG_ID_NAME2 = '英文'
const TAG_ID_NAME3 = 'Github'

// 统计网站数量
export function getWebCount(websiteList) {
  // 用户查看所有数量
  let userViewCount = 0
  // 登陆者统计所有数量
  let loginViewCount = 0
  let diffCount = 0
  function r(nav) {
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
  function r2(nav, ownVisible) {
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

// 设置网站的面包屑类目显示
export function setWeb(nav) {
  let id = 0 // 为每个网站设置唯一ID
  if (!Array.isArray(nav)) return

  function removeIconFont(item) {
    delete item.collapsed
    delete item.id
    if (!item.ownVisible) {
      delete item.ownVisible
    }
    item.icon ||= ''
    if (typeof item.icon === 'string' && item.icon.startsWith('icon')) {
      item.icon = ''
    }
  }

  function formatDate(item) {
    item.createdAt ||= Date.now()
    item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
  }

  for (let i = 0; i < nav.length; i++) {
    const item = nav[i]
    removeIconFont(item)
    formatDate(item)
    if (item.nav) {
      for (let j = 0; j < item.nav.length; j++) {
        const navItem = item.nav[j]
        removeIconFont(navItem)
        formatDate(navItem)
        if (navItem.nav) {
          for (let k = 0; k < navItem.nav.length; k++) {
            const navItemItem = navItem.nav[k]
            removeIconFont(navItemItem)
            formatDate(navItemItem)

            navItemItem.nav.sort((a, b) => {
              const aIdx = a.index == null || a.index === '' ? 100000 : a.index
              const bIdx = b.index == null || b.index === '' ? 100000 : b.index
              return aIdx - bIdx
            })
            if (navItemItem.nav) {
              for (let l = 0; l < navItemItem.nav.length; l++) {
                let breadcrumb = []
                const webItem = navItemItem.nav[l]
                formatDate(webItem)
                breadcrumb.push(item.title, navItem.title, navItemItem.title)
                breadcrumb = breadcrumb.filter(Boolean)
                webItem.breadcrumb = breadcrumb
                webItem.id = id += 1

                // 新字段补充
                webItem.urls ||= {}
                webItem.rate ??= 5
                webItem.top ??= false
                webItem.ownVisible ??= false
                webItem.name ||= ''
                webItem.desc ||= ''
                webItem.icon ||= ''

                webItem.name = webItem.name.replace(/<b>|<\/b>/g, '')
                webItem.desc = webItem.desc.replace(/<b>|<\/b>/g, '')

                delete webItem.__desc__
                delete webItem.__name__

                // 节省空间
                if (!webItem.top) {
                  delete webItem.top
                }
                if (!webItem.ownVisible) {
                  delete webItem.ownVisible
                }

                // 兼容现有标签,以id为key
                for (let k in webItem.urls) {
                  if (k === TAG_ID_NAME1) {
                    webItem.urls[TAG_ID1] = webItem.urls[k]
                    delete webItem.urls[TAG_ID_NAME1]
                  }
                  if (k === TAG_ID_NAME2) {
                    webItem.urls[TAG_ID2] = webItem.urls[k]
                    delete webItem.urls[TAG_ID_NAME2]
                  }
                  if (k === TAG_ID_NAME3) {
                    webItem.urls[TAG_ID3] = webItem.urls[k]
                    delete webItem.urls[TAG_ID_NAME3]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return nav
}

export function writeSEO(webs, payload) {
  const { settings, pkg } = payload
  if (!settings.openSEO) {
    return ''
  }
  const nowDate = dayjs.tz().format('YYYY-MM-DD HH:mm:ss')
  let seoTemplate = `
<div data-url="https://github.com/xjh22222228/nav" data-server-time="${Date.now()}" data-a="x.i.e-jiahe" data-date="${nowDate}" data-version="${
    pkg.version
  }" id="META-NAV" style="z-index:-1;position:fixed;top:-10000vh;left:-10000vh;">
`

  function r(navList) {
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

  r(webs)

  seoTemplate += '</div>'

  return seoTemplate
}

export function writeTemplate({ html, settings, seoTemplate }) {
  function getLoadKey() {
    const keys = Object.keys(LOAD_MAP)
    const rand = Math.floor(Math.random() * keys.length)
    const loadingKey =
      settings.loading === 'random' ? keys[rand] : settings.loading
    return loadingKey
  }
  const htmlTemplate = `
  <!-- https://github.com/xjh22222228/nav -->
  <title>${settings.title}</title>
  <meta name="description" content="${settings.description}">
  <meta name="keywords" content="${settings.keywords}" id="xjh_2">
  <link rel="icon" href="${settings.favicon}">
  <link rel ="apple-touch-icon" href="${settings.favicon}">
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

function correctURL(url) {
  if (!url) {
    return url
  }
  if (url[0] === '!') {
    return url.slice(1)
  }
  return url
}

export async function spiderWeb(db, settings) {
  let errorUrlCount = 0
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
    const requestPromises = []
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

    const promises = await Promise.allSettled(requestPromises)

    for (let i = 0; i < promises.length; i++) {
      const idx = current * max + i
      const item = items[idx]
      const res = promises[i].value
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
            `更新标题：${correctURL(item.url)}: "${item.title}" => "${
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
            `更新标题：${correctURL(item.url)}: "${item.title}" => "${
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
  console.log(`Time: ${diff} seconds`)

  return {
    webs: db,
    errorUrlCount,
    time: diff,
  }
}
