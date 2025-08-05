// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import type { ISettings, IWebProps, INavProps } from '../types'
import { CODE_SYMBOL } from 'src/constants/symbol'

export function replaceJsdelivrCDN(
  url: string = '',
  settings: ISettings,
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

type WebProps = {
  breadcrumb?: string[]
}

type DFSProps<T, F, C, C2> = {
  navs: T
  breadcrumb?: boolean
  sort?: (a: any, b: any) => number
  filter?: (data: F) => boolean
  callback?: (data: C) => boolean | void
  webCallback?: (data: C2, props: WebProps) => boolean | void
}

export function dfsNavs<
  T extends any[],
  F extends INavProps & IWebProps,
  C extends INavProps = INavProps,
  C2 extends IWebProps = IWebProps,
>(props: DFSProps<T, F, C, C2>): T {
  let cloneNavs = JSON.parse(JSON.stringify(props.navs)) as T
  if (props.filter) {
    cloneNavs = cloneNavs.filter(props.filter) as T
  }
  const breadcrumbMap = new Map<any, string[]>()
  if (props.breadcrumb) {
    cloneNavs.forEach((item: any) => {
      breadcrumbMap.set(item, [item.title])
    })
  }
  let stack = [...cloneNavs] as T
  while (stack.length > 0) {
    const item = stack.pop()
    if (item) {
      if (item.nav && Array.isArray(item.nav)) {
        if (props.filter) {
          item.nav = item.nav.filter(props.filter)
        }
        if (props.sort) {
          item.nav.sort(props.sort)
        }
        if (props.breadcrumb) {
          item.nav.forEach((navItem: any) => {
            const currentBreadcrumb = breadcrumbMap.get(item) || []
            const newBreadcrumb = [...currentBreadcrumb]
            if (navItem.title) {
              newBreadcrumb.push(navItem.title)
            }
            breadcrumbMap.set(navItem, newBreadcrumb)
          })
        }

        stack.push(...item.nav)
      }
      if (item.title) {
        const isBreak = props.callback?.(item)
        if (isBreak) {
          break
        }
      } else if (item.url) {
        const breadcrumb = breadcrumbMap.get(item)
        const isBreak = props.webCallback?.(item, { breadcrumb })
        if (isBreak) {
          break
        }
      }
    }
  }

  return cloneNavs
}

export function filterLoginData(navs: any[], isLogin: boolean): INavProps[] {
  function filterOwn(item: INavProps) {
    if (item.ownVisible && !isLogin) {
      return false
    }
    return true
  }

  return dfsNavs({
    navs,
    breadcrumb: true,
    filter: filterOwn,
    webCallback(web: IWebProps, props: WebProps) {
      web.tags ||= []
      web.breadcrumb = props.breadcrumb
    },
  })
}

export function cleanWebAttrs(navs: any) {
  return dfsNavs({
    navs,
    webCallback(web: IWebProps) {
      for (const k in web) {
        const removeKeys = ['breadcrumb', '__name__', '__desc__']
        if (removeKeys.includes(k)) {
          delete web[k]
        }
      }
      if (web.tags?.length === 0) {
        delete web.tags
      }
    },
  })
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

export function transformSafeHTML(str: string) {
  if (!str || str[0] === CODE_SYMBOL) {
    return str
  }
  const entity: any = {
    '<': '&lt;',
    '>': '&gt;',
  }
  return str.replace(/[<>]/g, (char) => entity[char])
}

export function transformUnSafeHTML(str: string) {
  const entity: any = {
    '&lt;': '<',
    '&gt;': '>',
  }
  return str.replace(/(&lt;|&gt;)/g, (char) => entity[char])
}
