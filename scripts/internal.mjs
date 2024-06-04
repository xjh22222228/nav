// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import path from 'path'

const dbPath = path.join('.', 'data', 'db.json')
const internalPath = path.join('.', 'data', 'internal.json')
const settingsPath = path.join('.', 'data', 'settings.json')

const internal = JSON.parse(fs.readFileSync(internalPath).toString())
const db = JSON.parse(fs.readFileSync(dbPath).toString())
const settings = JSON.parse(fs.readFileSync(settingsPath).toString())

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
  settings.showGithub ??= true
  settings.showLanguage ??= true
  settings.showRate ??= true
  settings.title ??= '发现导航 - 精选实用导航网站'
  settings.description ??= '发现导航 - 精选实用导航网站'
  settings.keywords ??=
    '导航,前端资源,社区站点,设计师,实用工具,学习资源,运营,网络安全,node.js'
  settings.theme ??= 'Light'
  settings.appTheme ??= 'App'
  settings.headerContent ??= ''
  settings.footerContent ??=
    '<div style="font-weight: bold;">共收录${total}个网站</div><div>Copyright © 2018-present nav3.cn, All Rights Reserved</div>'
  settings.baiduStatisticsUrl ??=
    'https://hm.baidu.com/hm.js?4582be7af7e7c95ef75351e07c6c32ba'
  settings.cnzzStatisticsUrl ??= ''
  settings.showThemeToggle ??= true
  settings.lightCardStyle ||= 'standard'
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
  settings.simCardStyle ||= 'standard'
  settings.simThemeHeight ??= 350
  settings.simThemeAutoplay ??= true
  settings.simTitle ||= ''
  settings.superCardStyle ||= 'column'
  // 更名
  if (settings.superCardStyle === 'super') {
    settings.superCardStyle = 'column'
  }
  settings.checkUrl ??= false
  settings.superTitle ??= ''
  const defImgs = [
    {
      src: 'https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/10.png',
      url: '',
      width: null,
      height: null,
    },
  ]
  settings.superImages ??= defImgs
  if (!Array.isArray(settings.superImages)) {
    settings.superImages = defImgs
  }
  settings.sideTitle ||= ''
  settings.sideCardStyle ||= 'example'
  settings.sideThemeHeight ??= 350
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
function setWeb(nav) {
  if (!Array.isArray(nav)) return

  function removeIconFont(item) {
    if (typeof item.icon === 'string' && item.icon.startsWith('icon')) {
      item.icon = ''
    }
  }

  for (let i = 0; i < nav.length; i++) {
    const item = nav[i]
    removeIconFont(item)
    if (item.nav) {
      for (let j = 0; j < item.nav.length; j++) {
        const navItem = item.nav[j]
        removeIconFont(navItem)
        if (navItem.nav) {
          for (let k = 0; k < navItem.nav.length; k++) {
            const navItemItem = navItem.nav[k]
            removeIconFont(navItemItem)
            if (navItemItem.nav) {
              for (let l = 0; l < navItemItem.nav.length; l++) {
                let breadcrumb = []
                const navItemItemItem = navItemItem.nav[l]
                breadcrumb.push(item.title, navItem.title, navItemItem.title)
                breadcrumb = breadcrumb.filter(Boolean)
                navItemItemItem.breadcrumb = breadcrumb

                // 新字段补充
                navItemItemItem.urls ||= {}
                navItemItemItem.rate ??= 5
                navItemItemItem.top ??= false
                navItemItemItem.ownVisible ??= false
                navItemItemItem.desc ||= ''
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
