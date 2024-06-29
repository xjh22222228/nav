// Copyright @ 2018-present x.iejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

const dbPath = path.join('.', 'data', 'db.json')
const internalPath = path.join('.', 'data', 'internal.json')
const settingsPath = path.join('.', 'data', 'settings.json')
const tagPath = path.join('.', 'data', 'tag.json')

let internal, db, settings, tags
try {
  internal = JSON.parse(fs.readFileSync(internalPath).toString())
  db = JSON.parse(fs.readFileSync(dbPath).toString())
  settings = JSON.parse(fs.readFileSync(settingsPath).toString())
  tags = JSON.parse(fs.readFileSync(tagPath).toString())
} catch (error) {
  internal = {}
  db = []
  settings = {}
  tags = []
}

const TAG_ID1 = -1
const TAG_ID2 = -2
const TAG_ID3 = -3
const TAG_ID_NAME1 = '中文'
const TAG_ID_NAME2 = '英文'
const TAG_ID_NAME3 = 'Github'
{
  if (!Array.isArray(tags)) {
    tags = []
  }
  const a = tags.some((item) => item.id === TAG_ID1)
  if (!a) {
    tags.push({
      id: TAG_ID1,
      name: '中文',
      color: '#2db7f5',
      createdAt: '',
      desc: '系统内置不可删除',
      isInner: true,
    })
  }
  const b = tags.some((item) => item.id === TAG_ID2)
  if (!b) {
    tags.push({
      id: TAG_ID2,
      name: '英文',
      color: '#f50',
      createdAt: '',
      desc: '系统内置不可删除',
      isInner: true,
    })
  }
  const c = tags.some((item) => item.id === TAG_ID3)
  if (!c) {
    tags.push({
      id: TAG_ID3,
      name: 'Github',
      color: '#108ee9',
      createdAt: '',
      desc: '系统内置不可删除',
      isInner: true,
    })
  }
  tags = tags.filter((item) => item.name && item.id)
  fs.writeFileSync(tagPath, JSON.stringify(tags), {
    encoding: 'utf-8',
  })
}

{
  const banner1 =
    'https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/banner1.jpg'
  const banner2 =
    'https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/banner2.jpg'
  const backgroundImg =
    'https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/background.jpg'

  settings.favicon ??=
    'https://cdn.jsdelivr.net/gh/xjh22222228/nav-web@image/logo.png'
  settings.homeUrl ??= 'https://nav3.cn'
  settings.language ??= 'zh-CN'
  settings.loading ??= 'random'
  settings.allowCollect ??= false
  settings.email ??= ''
  settings.showGithub ??= true
  settings.showLanguage ??= true
  settings.showRate ??= true
  settings.title ??= '发现导航 - 精选实用导航网站'
  settings.description ??= '发现导航 - 精选实用导航网站'
  settings.keywords ??=
    '导航,前端资源,社区站点,设计师,实用工具,学习资源,运营,网络安全,node.js'
  settings.theme ??= 'Light'
  settings.actionUrl ??= ''
  settings.appTheme ??= 'App'
  settings.openSEO ??= true
  settings.headerContent ??= ''
  settings.footerContent ??=
    '<div style="font-weight: bold;">共收录${total}个网站</div><div>Copyright © 2018-${year} ${hostname}, All Rights Reserved</div>'
  settings.baiduStatisticsUrl ??=
    'https://hm.baidu.com/hm.js?4582be7af7e7c95ef75351e07c6c32ba'
  settings.cnzzStatisticsUrl ??= ''
  settings.showThemeToggle ??= true
  settings.lightCardStyle ||= 'standard'
  settings.lightOverType ||= 'overflow'
  settings.simThemeImages ||= [
    {
      src: banner1,
      url: '',
      width: null,
      height: null,
    },
    {
      src: banner2,
      url: '',
      width: null,
      height: null,
    },
  ]
  settings.simThemeDesc ||=
    '这里收录多达 <b>${total}</b> 个优质网站， 助您工作、学习和生活'
  settings.simCardStyle ||= 'standard'
  settings.simOverType ||= 'overflow'
  settings.simThemeHeight ??= 0
  settings.simThemeAutoplay ??= true
  settings.simTitle ||= ''
  settings.superCardStyle ||= 'column'
  settings.superOverType ||= 'overflow'
  // 更名
  if (settings.superCardStyle === 'super') {
    settings.superCardStyle = 'column'
  }
  settings.checkUrl ??= false
  settings.superTitle ??= ''
  const defImgs = [
    {
      src: 'https://cdn.jsdelivr.net/gh/xjh22222228/nav-web@image/nav-1717494364392-ad.jpg',
      url: 'https://haokawx.lot-ml.com/Product/index/454266',
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/10.png',
      url: '',
    },
  ]
  settings.superImages ??= defImgs
  settings.lightImages ??= defImgs
  if (!Array.isArray(settings.superImages)) {
    settings.superImages = defImgs
  }
  if (!Array.isArray(settings.lightImages)) {
    settings.lightImages = defImgs
  }
  settings.sideTitle ||= ''
  settings.sideCardStyle ||= 'example'
  settings.sideThemeHeight ??= 0
  settings.sideThemeAutoplay ??= true
  settings.sideThemeImages ||= [
    {
      src: banner2,
      url: '',
      width: null,
      height: null,
    },
    {
      src: banner1,
      url: '',
      width: null,
      height: null,
    },
  ]
  settings.shortcutTitle ??= ''
  settings.shortcutThemeShowWeather ??= true
  settings.shortcutThemeImages ??= [
    {
      src: backgroundImg,
      url: '',
      width: null,
      height: null,
    },
  ]
  settings.mirrorList ||= []
  settings.spiderIcon ??= 'NO'
  settings.spiderDescription ??= 'NO'
  settings.spiderTitle ??= 'NO'
  settings.spiderQty ??= 20
  settings.loadingCode ??= ''
  fs.writeFileSync(settingsPath, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
}

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

const { userViewCount, loginViewCount } = getWebCount(db)
internal.userViewCount = userViewCount < 0 ? loginViewCount : userViewCount
internal.loginViewCount = loginViewCount
console.log(`
userViewCount: ${internal.userViewCount}
loginViewCount: ${internal.loginViewCount}
`)
fs.writeFileSync(internalPath, JSON.stringify(internal), { encoding: 'utf-8' })

// 设置网站的面包屑类目显示
let id = 0 // 为每个网站设置唯一ID
function setWeb(nav) {
  if (!Array.isArray(nav)) return

  function removeIconFont(item) {
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
            if (navItemItem.nav) {
              for (let l = 0; l < navItemItem.nav.length; l++) {
                let breadcrumb = []
                const webItem = navItemItem.nav[l]
                formatDate(webItem)
                breadcrumb.push(item.title, navItem.title, navItemItem.title)
                breadcrumb = breadcrumb.filter(Boolean)
                webItem.breadcrumb = breadcrumb
                webItem.id = id += 1

                // 网站没有图标 设置为父级图标
                if (!webItem.icon && typeof navItemItem?.icon === 'string') {
                  webItem.icon = navItemItem.icon
                }

                // 新字段补充
                webItem.urls ||= {}
                webItem.rate ??= 5
                webItem.top ??= false
                webItem.ownVisible ??= false
                webItem.desc ||= ''

                delete webItem.__desc__
                delete webItem.__name__

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
const data = setWeb(db)
fs.writeFileSync(dbPath, JSON.stringify(data), { encoding: 'utf-8' })
