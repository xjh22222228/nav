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

settings.showThemeToggle ??= true
settings.lightCardStyle ||= 'standard'
settings.simCardStyle ||= 'standard'
settings.sideCardStyle ||= 'standard'
fs.writeFileSync(settingsPath, JSON.stringify(settings), { encoding: 'utf-8' })

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

  for (let i = 0; i < nav.length; i++) {
    const item = nav[i]

    if (item.nav) {
      for (let j = 0; j < item.nav.length; j++) {
        const navItem = item.nav[j]
        if (navItem.nav) {
          for (let k = 0; k < navItem.nav.length; k++) {
            const navItemItem = navItem.nav[k]
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
