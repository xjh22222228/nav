// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

export type ThemeType =
  | 'Light'
  | 'Sim'

export interface INavFourProp {
  icon?: string | null
  createdAt?: string
  name: string
  desc: string
  url?: string
  urls?: {
    [key: string]: string
  }
}

export interface INavThreeProp {
  title?: string
  icon?: string | null
  createdAt?: string
  showSideIcon?: boolean
  collapsed?: boolean
  nav: INavFourProp[]
}

export interface INavTwoProp {
  title?: string
  icon?: string | null
  createdAt?: string
  collapsed?: boolean
  nav: INavThreeProp[]
}

export interface INavProps extends Object {
  title: string
  id?: number
  icon?: string | null
  createdAt?: string
  nav: INavTwoProp[]
}

export interface ISearchEngineProps {
  name: string
  url?: string
  icon: string | null
  placeholder?: string
}

export interface IConfig {
  gitRepoUrl: string
  hashMode: boolean
  homeUrl?: string
  title: string
  description: string
  keywords: string
  theme: ThemeType
  searchEngineList: ISearchEngineProps[]
  footerContent?: string|null
  baiduStatisticsUrl?: string
  cnzzStatisticsUrl?: string

  lightThemeConfig: {
    backgroundLinear: string[]
  },

  simThemeConfig: {
    posterImageUrls: string[]
    description: string
  }
}
