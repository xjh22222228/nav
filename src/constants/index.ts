// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

function isMac() {
  return /mac os x/i.test(navigator.userAgent.toLowerCase());
}

export const DB_PATH = 'data/db.json'

export const VERSION = '5.0.6'

// keyboard event
const prefix = isMac() ? 'command' : 'ctrl'
export const KEY_MAP = {
  // 编辑模式
  edit: `${prefix}+e`,

  // 查看信息
  view: `${prefix}+v`,

  // 暗黑模式
  dark: `${prefix}+d`
}
