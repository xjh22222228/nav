// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

export type ThemeType =
  | 'Light'
  | 'Sim'
  | 'Side'
  | 'App'
  | 'Shortcut'

export interface ITagProp {
  [tagName: string]: {
    color: string
    createdAt: string
    desc?: string
  }
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
}

export interface INavTwoProp {
  title?: string
  icon?: string | null
  createdAt?: string
  collapsed?: boolean
  ownVisible?: boolean
  nav: INavThreeProp[]
}

export interface INavProps extends Object {
  title: string
  id?: number
  icon?: string | null
  createdAt?: string
  ownVisible?: boolean
  nav: INavTwoProp[]
}

export interface ISearchEngineProps {
  name: string
  url?: string
  icon: string | null
  placeholder?: string
  blocked: boolean
}

export interface IConfig {
  language?: 'zh-CN' | 'en'
  gitRepoUrl: string
  branch: string
  loading?: string
  hashMode: boolean
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

  simThemeConfig: {
    posterImageUrls: string[]
    description: string
  }
}
