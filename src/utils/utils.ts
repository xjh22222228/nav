// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import navConfig from '../../nav.config.json'
import { internal } from 'src/store'
import { isLogin } from 'src/utils/user'
import { CODE_SYMBOL } from 'src/constants/symbol'

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
  cssUrl: navConfig.zorroDark,
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

export function parseHtmlWithContent(node: HTMLElement, str: string) {
  if (str[0] === CODE_SYMBOL) {
    if (!node) return
    const s = node.querySelectorAll('script')
    s.forEach((script) => {
      script.parentNode?.removeChild(script)
    })

    const parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')
    const scripts = doc.querySelectorAll('script')
    scripts.forEach((script) => {
      const newScript: any = document.createElement('script')
      const text = script.textContent?.trim() || ''
      const attributes = script.attributes
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i]
        newScript[attr.name] = attr.value
      }
      if (text) {
        newScript.textContent = `{${text}}`
      }
      node.appendChild(newScript)
    })
  }
}

export function parseLoadingWithContent(str: string): string {
  if (str[0] !== '!') {
    return str
  }
  const loadingHtml = `
<div class="x31">
  <svg viewBox="25 25 50 50" class="x21">
    <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
  </svg>
</div>
`
  str = str.slice(1)
  if (str.includes('#loadingx1')) {
    return str.replaceAll('#loadingx1', '') + loadingHtml
  }
  return str
}

export function getTempId() {
  return -Date.now()
}
