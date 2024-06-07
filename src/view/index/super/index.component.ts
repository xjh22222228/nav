// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from 'src/types'
import {
  fuzzySearch,
  queryString,
  matchCurrentList,
  getOverIndex,
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { settings, searchEngineList, websiteList } from 'src/store'

@Component({
  selector: 'app-side',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SideComponent {
  LOGO_CDN = settings.favicon
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  selectedIndex = 0 // 第三级菜单选中
  title: string = settings.title.trim().split(/\s/)[0]
  searchEngineList = searchEngineList
  isLogin = isLogin
  settings = settings
  overIndex = Number.MAX_SAFE_INTEGER

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const { id, page, q } = queryString()
      this.page = page
      this.id = id
      this.handleCheckThree(0)

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }
    })
  }

  ngAfterViewInit() {
    if (this.settings.superOverType === 'ellipsis') {
      queueMicrotask(() => {
        const overIndex = getOverIndex('.topnav .over-item')
        if (this.overIndex === overIndex) {
          return
        }
        this.overIndex = overIndex
      })
    }
  }

  handleCilckTopMenu(index: number) {
    const id = this.websiteList[index].id || 0
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page: index,
        id,
        _: Date.now(),
      },
    })
  }

  handleSidebarNav(index: number) {
    const { page } = queryString()
    this.websiteList[page].id = index
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page,
        id: index,
        _: Date.now(),
      },
    })
  }

  handleCheckThree(index: number) {
    this.selectedIndex = index
  }
}
