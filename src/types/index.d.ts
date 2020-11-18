
export interface INavFourProp {
  icon?: string | null
  name: string
  desc: string
  link: string
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

export interface INavProps {
  title: string
  id?: number
  nav: INavTwoProp[]
}

export interface ISearchEngineProps {
  name: string
  url: string
  icon: string
  placeholder?: string
}
