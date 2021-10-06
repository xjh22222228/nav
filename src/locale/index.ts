import config from '../../nav.config'
import english from "./english"
import zh_CN from "./zh_CN"
import { STORAGE_KEY_MAP } from 'src/constants'

const o = {
  en: english,
  cn: zh_CN
}

export function getLocale(): string {
  return window.localStorage.getItem(STORAGE_KEY_MAP.language) || config.language
}

export function $t(s): string {
  if (getLocale() === 'zh-CN') {
    return o.cn[s]
  }
  return o.en[s]
}

export default o
