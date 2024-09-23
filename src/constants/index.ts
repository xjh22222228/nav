// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import navConfig from '../../nav.config.json'

export const DB_PATH = 'data/db.json'

export const TAG_PATH = 'data/tag.json'

export const SETTING_PATH = 'data/settings.json'

export const SEARCH_PATH = 'data/search.json'

export const COMPONENT_PATH = 'data/component.json'

export const VERSION = navConfig.version

export const STORAGE_KEY_MAP = {
  token: 'token',
  location: 'location',
  s_url: 's_url',
  isDark: 'isDark',
  website: 'WEBSITE_DB',
  engine: 'engine',
  language: 'language',
  total: 'total',
  authCode: 'AUTH_CODE',
  sideCollapsed: 'SIDE_COLLAPSED',
  fixbarOpen: 'FIXBAR_OPEN',
}
