// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
import english from './english'
import zh_CN from './zh_CN'
import { STORAGE_KEY_MAP } from 'src/constants'
import { settings } from 'src/store'

const o = {
  en: english,
  cn: zh_CN,
}

export function getLocale(): string {
  return (
    window.localStorage.getItem(STORAGE_KEY_MAP.language) || settings.language
  )
}

const l = getLocale()

export function $t(s: string, map?: Record<string, any>): string {
  function replaceStr(s: string, map?: Record<string, any>) {
    if (map) {
      for (const k in map) {
        s = s.replaceAll(`{${k}}`, map[k])
      }
    }
    return s
  }
  if (l === 'zh-CN') {
    return replaceStr(o.cn[s], map)
  }
  return replaceStr(o.en[s] ?? o.cn[s], map)
}

export function isZhCN(): boolean {
  return l === 'zh-CN'
}

export default o
