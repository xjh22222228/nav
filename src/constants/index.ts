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
  TOKEN: 'token',
  LOCATION: 'location',
  DATE_TIME: 's_url',
  IS_DARK: 'isDark',
  WEBSITE: 'WEBSITE_DB',
  SEARCH_ENGINE: 'engine',
  LANGUAGE: 'language',
  AUTH_CODE: 'AUTH_CODE',
  SIDE_COLLAPSED: 'SIDE_COLLAPSED',
  FIXBAR_OPEN: 'FIXBAR_OPEN',
  SYSTEM_COLLAPSED: 'SYSTEM_COLLAPSED',
  NEWS: 'NEWS',
  NEWS_DATE: 'NEWS_DATE',
  COMPONENT_COLLAPSED: 'COMPONENT_COLLAPSED',
}
