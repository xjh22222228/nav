// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from 'src/types'
import {
  fuzzySearch,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
  matchCurrentList
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { websiteList } from 'src/store'
import { NzIconService } from 'ng-zorro-antd/icon'
import { settings, searchEngineList } from 'src/store'

@Component({
  selector: 'app-side',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class SideComponent {
  LOGO_CDN = settings.favicon
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  title: string = settings.title.trim().split(/\s/)[0]
  openIndex = queryString().page
  searchEngineList = searchEngineList
  isLogin = isLogin
  sideThemeImages = settings.sideThemeImages
  sideThemeHeight = settings.sideThemeHeight
  sideThemeAutoplay = settings.sideThemeAutoplay

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconService: NzIconService
  ) {
    if (settings.iconfontUrl) {
      this.iconService.fetchFromIconfont({
        scriptUrl: settings.iconfontUrl
      })
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const { id, page, q } = queryString()
      this.page = page
      this.id = id

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }

      setWebsiteList(this.websiteList)
    })
  }

  handleSidebarNav(page, id) {
    this.websiteList[page].id = id
    this.router.navigate([this.router.url.split('?')[0]], { 
      queryParams: {
        page,
        id,
      }
    })
    this.handlePositionTop()
  }

  handlePositionTop() {
    setTimeout(() => {
      const el = document.querySelector('.search-header') as HTMLDivElement
      console.log(el)
      if (el) {
        const h = el.offsetHeight;
        window.scroll({
          top: h,
          left: 0,
          behavior: 'smooth'
        })
      }
    }, 10)
  }

  onCollapse = (item, index) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = (e: Event) => {
    e?.stopPropagation()
    toggleCollapseAll(this.websiteList)
    this.handlePositionTop()
  }

  collapsed() {
    try {
      return websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }
}
