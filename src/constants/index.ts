// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { getCDN } from '../services'

function isMac() {
  return /mac os x/i.test(navigator.userAgent.toLowerCase());
}

export const DB_PATH = 'data/db.json'

export const TAG_PATH = 'data/tag.json'

export const LOGO_PATH = 'logo.png'

export const LOGO_CDN = getCDN('logo.png')

export const VERSION = '5.3.3'

// keyboard event
const prefix = isMac() ? 'command' : 'ctrl'
export const KEY_MAP = {
  // 查看信息
  view: `${prefix}+v`,

  // 暗黑模式
  dark: `${prefix}+d`
}

export const STORAGE_KEY_MAP = {
  token: 'token',
  location: 'location',
  s_url: 's_url',
  isDark: 'isDark',
  website: 'website',
  engine: 'engine',
  language: 'language'
}
