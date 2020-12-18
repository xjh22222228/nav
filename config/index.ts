/**
 * 所有配置通过此文件进行配置
 * @author xiejiahe
 * @url https://github.com/xjh22222228/nav
 */
import { ISearchEngineProps, ThemeType } from '../src/types'

// 主题: light | sim
export const THEME: ThemeType = 'light'

// 搜索引擎列表, 为空时不显示搜索引擎
// 以下系统内置了一些，需要其他的自行添加
// 自定义引擎 icon 建议使用网络图标 减少入侵
export const SEARCH_ENGINE_LIST: ISearchEngineProps[] = [
  {
    name: '站内',
    icon: 'assets/logo.png',
    placeholder: '站内搜索'
  },
  {
    name: '百度',
    url: 'https://www.baidu.com/s?wd=',
    icon: 'assets/engine/baidu.svg',
    placeholder: '百度一下'
  },
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: 'assets/engine/google.svg',
  },
  {
    name: '必应',
    url: 'https://cn.bing.com/search?q=',
    icon: 'assets/engine/bing.svg',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/search?q=',
    icon: 'assets/engine/github.svg',
    placeholder: 'Search GitHub'
  },
  {
    name: '知乎',
    url: 'https://www.zhihu.com/search?type=content&q=',
    icon: 'assets/engine/zhihu.svg',
  },
  {
    name: '豆瓣',
    url: 'https://search.douban.com/book/subject_search?search_text=',
    icon: 'assets/engine/douban.svg',
    placeholder: '书名、作者、ISBN'
  }
]

// 网站标题
export const TITLE = '发现导航 - 精选实用导航网站'

// Git 仓库地址, 没有填空字符串
export const GIT_REPO_URL = 'https://github.com/xjh22222228/nav'

// 错误图标, 图标地址访问不了时显示
// 建议使用网络地址，放在您任何服务器上, 减少入侵
export const ERROR_ICON = ''

// 网站底部描述, 可以是 HTML
// 可以是版权信息，备案号
export const FOOTER_DESC = ''

// 百度统计
export const TONGJI_URL = 'https://hm.baidu.com/hm.js?4582be7af7e7c95ef75351e07c6c32ba'

export const INDEX_LANGUAGE = [
  '英文',
  '中文',
  'GitHub'
]

export const APP_LANGUAGE = [
  'EN',
  'CN',
  'Git'
]

// http://www.nav3.cn/#/index?q=grabient
export const BACKGROUND_LINEAR = [
  'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
  'linear-gradient(90deg, #FEE140 0%, #FA709A 100%)',
  'linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)',
  'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)',
  'linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)',
  'linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)',
  'linear-gradient(180deg, #52ACFF 25%, #FFE32C 100%)',
  'linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)',
  'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)',
  'linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)',
  'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
  'linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)',
  'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
  'linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)',
  'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
  'linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%)',
  'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
  'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)',
  'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
  'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)',
  'linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%)',
  'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
  'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
  'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)',
  'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
  'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)'
]
