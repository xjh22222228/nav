// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import navConfig from '../../nav.config.json'
import { internal } from 'src/store'
import { isLogin } from 'src/utils/user'

// 是否自有部署
export const isSelfDevelop = !!navConfig.address

export function compilerTemplate(str: string) {
  return str
    .replaceAll(
      '${total}',
      String(isLogin ? internal.loginViewCount : internal.userViewCount)
    )
    .replaceAll('${hostname}', window.location.hostname)
    .replaceAll('${year}', String(new Date().getFullYear()))
}

export function addDark() {
  const darkCSS = '//unpkg.com/ng-zorro-antd@18.2.1/ng-zorro-antd.dark.min.css'
  const id = 'dark-css'
  const darkNode = document.getElementById(id)
  if (darkNode) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = darkCSS
  link.id = id
  document.body.appendChild(link)
  document.documentElement.classList.add('dark-container', 'dark')
}

export function removeDark() {
  const id = 'dark-css'
  const darkNode = document.getElementById(id)
  document.documentElement.classList.remove('dark-container', 'dark')
  if (darkNode) {
    darkNode.parentNode?.removeChild(darkNode)
  }
}
