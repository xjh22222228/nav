// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

export type ThemeType =
  | 'Current'
  | 'Light'
  | 'Sim'
  | 'Side'
  | 'App'
  | 'Shortcut'

export enum TopType {
  Side = 1,
  Shortcut,
}

export enum ComponentType {
  Calendar = 1,
  OffWork = 2,
  Runtime = 3,
  Image = 4,
  Countdown = 5,
  HTML = 6,
  Holiday = 7,
}

export enum ActionType {
  Create = 1,
  Edit = 2,
  Delete = 3,
}

export interface IComponentProps {
  id: number
  type: number
  [key: string]: any
}

export type ICardType = 'standard' | 'column' | 'example' | 'retro' | 'original'

type OverType = 'overflow' | 'ellipsis'

type Spider = 'NO' | 'EMPTY' | 'ALWAYS'

export interface ITagPropValues {
  id: number
  name: string
  color: string
  desc: string
  isInner: boolean

  [key: string]: any
}

export interface ITagProp {
  [tagName: string]: ITagPropValues
}

export interface IWebTag {
  id: number | string
  url: string
}

export interface BaseNavItem {
  id: number
  title: string
  icon: string
  collapsed?: boolean
  ownVisible?: boolean
}

export interface IWebProps {
  id: number
  name: string
  desc: string
  url: string
  icon: string
  breadcrumb: string[]
  tags: IWebTag[]
  rId?: number
  __name__?: string // 搜索原name值
  __desc__?: string
  rate?: number // 0-5
  top?: boolean
  topTypes?: number[]
  index?: number | string // sort
  ownVisible?: boolean
  ok?: boolean
  [key: string]: any
}

export interface INavThreeProp extends BaseNavItem {
  nav: IWebProps[]
  rId?: number
  [key: string]: any
}

export interface INavTwoProp extends BaseNavItem {
  nav: INavThreeProp[]
  rId?: number
  [key: string]: any
}

export interface INavProps extends BaseNavItem {
  nav: INavTwoProp[]
  [key: string]: any
}

export interface ISearchProps {
  name: string
  icon: string
  blocked: boolean
  isInner: boolean
  url?: string
  placeholder?: string
}

export interface ImageProps {
  url: string
  src: string
}

export interface IClassProps {
  id: number
  title: string
  icon: string
  ownVisible?: boolean
}

export interface ISettings {
  favicon: string
  language: 'zh-CN' | 'en'
  loading: string
  title: string
  description: string
  keywords: string
  theme: ThemeType
  openSEO: boolean
  appTheme: ThemeType
  footerContent: string
  headerContent: string
  showGithub: boolean
  showLanguage: boolean
  showCopy?: boolean
  showShare?: boolean
  showThemeToggle: boolean
  actionUrl: string | null
  checkUrl: boolean
  errorUrlCount?: number

  appCardStyle: ICardType
  appDocTitle: string

  lightCardStyle: ICardType
  lightOverType: OverType
  lightImages: ImageProps[]
  lightFooterHTML: string
  lightDocTitle: string

  simThemeImages: ImageProps[]
  simThemeDesc: string
  simThemeHeight: number
  simThemeAutoplay: boolean
  simCardStyle: ICardType
  simTitle: string
  simOverType: OverType
  simFooterHTML: string
  simDocTitle: string

  sideThemeImages: ImageProps[]
  sideThemeHeight: number
  sideThemeAutoplay: boolean
  sideCardStyle: ICardType
  sideTitle: string
  sideFooterHTML: string
  sideCollapsed: boolean
  sideDocTitle: string

  shortcutThemeImages: ImageProps[]
  shortcutThemeShowWeather: boolean
  shortcutTitle: string
  shortcutDockCount: number
  shortcutDocTitle: string

  superTitle: string
  superOverType: OverType
  superCardStyle: ICardType
  superImages: ImageProps[]
  superFooterHTML: string
  superDocTitle: string

  showRate: boolean
  userActions: ActionType[]
  email: string

  spiderIcon: Spider
  spiderDescription: Spider
  spiderTitle: Spider
  spiderQty: number
  spiderTimeout: number

  loadingCode: string
  openSearch: boolean
  gitHubCDN: string
  components: IComponentProps[]

  runtime: number

  [key: string]: any
}

export type InternalProps = {
  loginViewCount: number
  userViewCount: number
}
