// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import path from 'path'

const dbPath = path.join('.', 'data', 'db.json')
const internalPath = path.join('.', 'data', 'internal.json')

const internal = JSON.parse(fs.readFileSync(internalPath).toString())
const db = JSON.parse(fs.readFileSync(dbPath).toString())

// 统计网站数量
export function getWebCount(websiteList) {
  // 用户查看所有数量
  let userViewCount = 0
  // 登陆者统计所有数量
  let loginViewCount = 0
  function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.url) {
        loginViewCount += 1
        userViewCount += 1
        // 仅登陆者可见
        if (item.ownVisible) {
          userViewCount -= 1
        }
      } else {
        r(item.nav)
      }
    }
  }
  r(websiteList)
  return {
    userViewCount,
    loginViewCount,
  }
}

const { userViewCount, loginViewCount } = getWebCount(db)
internal.userViewCount = userViewCount
internal.loginViewCount = loginViewCount
fs.writeFileSync(internalPath, JSON.stringify(internal), { encoding: 'utf-8' })
