// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import navConfig from '../../nav.config.json'
import { internal } from 'src/store'
import { isLogin } from 'src/utils/user'

// 是否自有部署
export const isSelfDevelop = !!navConfig.address

interface TemplateData {
  total: number
  hostname: string
  year: number
}

export function compilerTemplate(str: string): string {
  const data: TemplateData = {
    total: isLogin ? internal.loginViewCount : internal.userViewCount,
    hostname: window.location.hostname,
    year: new Date().getFullYear(),
  }

  return Object.entries(data).reduce(
    (result, [key, value]) => result.replaceAll(`\${${key}}`, String(value)),
    str
  )
}

const DARK_THEME = {
  cssUrl: '//unpkg.com/ng-zorro-antd@19.0.2/ng-zorro-antd.dark.min.css',
  cssId: 'dark-css',
  classes: ['dark-container', 'dark'],
} as const

export function addDark(): void {
  const darkNode = document.getElementById(DARK_THEME.cssId)
  if (darkNode) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = DARK_THEME.cssUrl
  link.id = DARK_THEME.cssId
  document.body.appendChild(link)
  document.documentElement.classList.add(...DARK_THEME.classes)
}

export function removeDark(): void {
  const darkNode = document.getElementById(DARK_THEME.cssId)
  document.documentElement.classList.remove(...DARK_THEME.classes)
  darkNode?.parentNode?.removeChild(darkNode)
}
