// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

export type ThemeType =
  | 'light'
  | 'sim'

export interface INavFourProp {
  icon?: string | null
  name: string
  desc: string
  url?: string
  language?: string|null|undefined[]
}

export interface INavThreeProp {
  title?: string
  icon?: string | null
  showSideIcon?: boolean
  collapsed?: boolean
  nav: INavFourProp[]
}

export interface INavTwoProp {
  title?: string
  icon?: string | null
  collapsed?: boolean
  nav: INavThreeProp[]
}

export interface INavProps extends Object {
  title: string
  id?: number
  icon?: string | null
  nav: INavTwoProp[]
}

export interface ISearchEngineProps {
  name: string
  url?: string
  icon: string | null
  placeholder?: string
}

export interface IConfig {
  title: string
  theme: ThemeType
  posterImageUrl: string
  searchEngineList: ISearchEngineProps[]
  gitRepoUrl: string,
  footerCopyright: string|null
  tongjiUrl: string
  indexLanguage: string[]
  appLanguage: string[]
  backgroundLinear: string[]
}
