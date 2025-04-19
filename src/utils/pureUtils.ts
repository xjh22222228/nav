// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import type { ISettings, IWebProps, INavProps } from '../types'

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

export function getIsGitLab(gitRepoUrl: string): boolean {
  return gitRepoUrl.includes('gitlab.c')
}

export function removeTrailingSlashes(url: string | null | undefined): string {
  if (!url) {
    return ''
  }
  return url.replace(/\/+$/, '')
}

export function filterLoginData(
  websiteList: any[],
  isLogin: boolean
): INavProps[] {
  function filterOwn(item: INavProps) {
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
      for (let j = 0; j < item.nav.length; j++) {
        const twoItem = item.nav[j]
        if (Array.isArray(twoItem.nav)) {
          twoItem.nav = twoItem.nav.filter(filterOwn)
          for (let k = 0; k < twoItem.nav.length; k++) {
            const threeItem = twoItem.nav[k]
            if (Array.isArray(threeItem.nav)) {
              threeItem.nav = threeItem.nav.filter(filterOwn)
              for (let l = 0; l < threeItem.nav.length; l++) {
                const web = threeItem.nav[l] as IWebProps
                web.breadcrumb = [item.title, twoItem.title, threeItem.title]
                web.tags ||= []
              }
            }
          }
        }
      }
    }
  }

  return websiteList
}

export function cleanWebAttrs(data: any) {
  if (!Array.isArray(data)) {
    return
  }
  data.forEach((item) => {
    if (item.url) {
      for (const k in item) {
        const removeKeys = ['breadcrumb', '__name__', '__desc__']
        if (removeKeys.includes(k)) {
          delete item[k]
        }
      }
      if (item.tags?.length === 0) {
        delete item.tags
      }
    }
    if (Array.isArray(item.nav)) {
      cleanWebAttrs(item.nav)
    }
  })

  return data
}

export function isNumber(v: any): boolean {
  if (v === '' || v == null) {
    return false
  }
  if (isNaN(v)) {
    return false
  }
  return true
}
