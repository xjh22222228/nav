// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import type { ISettings } from '../types'

export function replaceJsdelivrCDN(
  url: string = '',
  settings: ISettings
): string {
  const cdn = settings?.gitHubCDN
  if (!cdn) {
    return url
  }
  url = url.replace('cdn.jsdelivr.net', cdn)
  url = url.replace('testingcf.jsdelivr.net', cdn)
  url = url.replace('img.jsdmirror.com', cdn)
  url = url.replace('gcore.jsdelivr.net', cdn)
  return url
}

export function getIsGitee(gitRepoUrl: string): boolean {
  return gitRepoUrl.includes('gitee.com')
}

export function removeTrailingSlashes(url: string | null | undefined): string {
  if (!url) {
    return ''
  }
  return url.replace(/\/+$/, '')
}

export function filterLoginData(websiteList: any[], isLogin: boolean): any[] {
  function filterOwn(item: any) {
    if (item.ownVisible && !isLogin) {
      return false
    }
    return true
  }
  websiteList = websiteList.filter(filterOwn)
  for (let i = 0; i < websiteList.length; i++) {
    const item = websiteList[i]

    if (Array.isArray(item.nav)) {
      item.nav = item.nav.filter(filterOwn)
      filterLoginData(item.nav, isLogin)
    }
  }

  return websiteList
}
