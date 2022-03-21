// Copyright @ 2018-2022 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

export type ThemeType =
  | 'Light'
  | 'Sim'
  | 'Side'
  | 'App'
  | 'Shortcut'


export interface ITagPropValues {
  name?: string
  color: string
  createdAt: string
  desc: string
  isInner: boolean
}

export interface ITagProp {
  [tagName: string]: ITagPropValues
}

export interface INavFourProp {
  name: string
  desc: string
  url: string
  icon?: string | null
  createdAt?: string
  rate?: number // 0-5
  top?: boolean
  index?: number // sort
  ownVisible?: boolean
  urls?: {
    [tagName: string]: string
  }
}

export interface INavThreeProp {
  title?: string
  icon?: string | null
  createdAt?: string
  collapsed?: boolean
  ownVisible?: boolean
  nav: INavFourProp[]
  [key: string]: any
}

export interface INavTwoProp {
  title?: string
  icon?: string | null
  createdAt?: string
  collapsed?: boolean
  ownVisible?: boolean
  nav: INavThreeProp[]
  [key: string]: any
}

export interface INavProps extends Object {
  title: string
  id?: number
  icon?: string | null
  createdAt?: string
  ownVisible?: boolean
  nav: INavTwoProp[]
  [key: string]: any
}

export interface ISearchEngineProps {
  name: string
  url?: string
  icon: string | null
  placeholder?: string
  blocked: boolean
  isInner: boolean
}

export interface ISettings {
  favicon: string
  language: 'zh-CN' | 'en'
  loading: string
  homeUrl?: string
  title: string
  description: string
  keywords: string
  theme: ThemeType
  footerContent?: string|null
  baiduStatisticsUrl?: string
  cnzzStatisticsUrl?: string
  iconfontUrl?: string
  showGithub: boolean
  showLanguage: boolean

  simThemeImages: Record<string, string>[]
  simThemeDesc: string
  simThemeHeight: number
  simThemeAutoplay: boolean

  sideThemeImages: Record<string, string>[]
  sideThemeHeight: number
  sideThemeAutoplay: boolean

  shortcutThemeImages: Record<string, string>[]
  shortcutThemeShowWeather: boolean

  showRate: boolean
  mirrorList: Record<string, string>[]
}

export interface IConfig {
  gitRepoUrl: string
  branch: string
  hashMode: boolean
}
