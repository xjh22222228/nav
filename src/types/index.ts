// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

export type ThemeType = 'Light' | 'Sim' | 'Side' | 'App' | 'Shortcut' | 'Super'

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
  News = 8,
}

export enum ActionType {
  Create = 1,
  Edit = 2,
  Delete = 3,
}

export enum NewsType {
  Weibo = 1,
  V2ex = 2,
  Douyin = 3,
  Bilibili = 4,
  Juejin = 5,
  Baidu = 6,
  GitHub = 7,
  Pojie52 = 8,
  Xiaohongshu = 9,
  Toutiao = 10,
  Douban = 11,
  HackerNews = 12,
  Zhihu = 13,
  ZhihuDaily = 14,
}

export interface INewsProps {
  types: NewsType[]
  count: number
  bgColor: string
}

export interface ICalendarProps {
  topColor: string
  bgColor: string
}

export interface IOffWorkProps {
  workTitle: string
  restTitle: string
  startDate: number
  date: number | string
}

export interface IImageProps {
  url: string
  go: string
  text: string
}

export interface ICountdownProps {
  topColor: string
  bgColor: string
  url: string
  title: string
  dateColor: string
  dayColor: string
  date: string
}

export interface IRuntimeProps {
  title: string
}

export interface IHtmlProps {
  html: string
  width: number
  bgColor: string
}

export interface IHolidayProps {
  items: any[]
}

export interface IComponentItemProps
  extends Partial<Omit<INewsProps, 'bgColor'>>,
    Partial<ICalendarProps>,
    Partial<IOffWorkProps>,
    Partial<IImageProps>,
    Partial<Omit<ICountdownProps, 'date'>>,
    Partial<IRuntimeProps>,
    Partial<Omit<IHtmlProps, 'bgColor'>> {
  id: number
  type: number
  [key: string]: any
}

export interface IComponentProps {
  zoom: number
  components: IComponentItemProps[]
}

export type ICardType =
  | 'standard'
  | 'column'
  | 'example'
  | 'retro'
  | 'original'
  | 'poster'
  | 'icon'

type OverType = 'overflow' | 'ellipsis'

type Spider = 'NO' | 'EMPTY' | 'ALWAYS'

export interface ITagPropValues {
  id: number
  name: string
  color: string
  desc: string
  isInner: boolean
  sort?: number | string

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
  breadcrumb?: string[]
  tags?: IWebTag[]
  img?: string
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

export interface ISearchItemProps {
  name: string
  icon: string
  blocked: boolean
  isInner: boolean
  url?: string
  placeholder?: string
}

export interface ISearchProps {
  logo: string
  darkLogo: string
  height: number
  list: ISearchItemProps[]
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
  appTheme: ThemeType | 'Current'
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
  createWebKey: string
  logo: string
  darkLogo: string

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
  spiderImg: Spider
  spiderQty: number
  spiderTimeout: number

  loadingCode: string
  openSearch: boolean
  gitHubCDN: string
  components: IComponentItemProps[]

  runtime: number

  [key: string]: any
}

export type InternalProps = {
  loginViewCount: number
  userViewCount: number
}
