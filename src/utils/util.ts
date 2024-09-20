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
