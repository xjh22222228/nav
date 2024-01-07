// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
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
  searchEngineList = searchEngineList
  isLogin = isLogin
  sideThemeImages = settings.sideThemeImages
  sideThemeHeight = settings.sideThemeHeight
  sideThemeAutoplay = settings.sideThemeAutoplay
  sliceMax = 1

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
      this.sliceMax = 1

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }
      setTimeout(() => {
        this.sliceMax = Number.MAX_SAFE_INTEGER
      }, 25)
    })
  }

  handleSidebarNav(page: any, id: any) {
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
      if (el) {
        const h = el.offsetHeight;
        window.scroll({
          top: h,
          left: 0,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  openMenu(item: any, index: number) {
    this.websiteList.forEach((data, idx) => {
      if (idx === index) {
        data.collapsed = !data.collapsed
      } else {
        data.collapsed = false
      }
    })
    setWebsiteList(this.websiteList)
  }

  onCollapse = (item: any, index: number) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = (e: Event) => {
    e?.stopPropagation()
    toggleCollapseAll(this.websiteList)
    this.handlePositionTop()
  }

  handleJumpUrl(data) {
    if (data.url) {
      window.open(data.url)
    }
  }

  collapsed() {
    try {
      return !!websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }
}
