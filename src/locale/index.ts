import english from "./english"
import zh_CN from "./zh_CN"
import { STORAGE_KEY_MAP } from 'src/constants'
import { settings } from 'src/store'

const o = {
  en: english,
  cn: zh_CN
}

export function getLocale(): string {
  return window.localStorage.getItem(STORAGE_KEY_MAP.language) || settings.language
}

const l = getLocale()

export function $t(s): string {
  if (l === 'zh-CN') {
    return o.cn[s]
  }
  return o.en[s] ?? o.cn[s]
}

export default o
