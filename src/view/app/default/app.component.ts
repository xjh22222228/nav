// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString, fuzzySearch, matchCurrentList } from 'src/utils'
import { INavProps, INavThreeProp } from 'src/types'
import { websiteList, settings, tagMap } from 'src/store'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class WebpComponent {
  objectKeys = Object.keys
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  open: boolean = false
  settings = settings
  tagMap = tagMap
  searchKeyword = ''
  sliceMax = 0

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const init = () => {
      this.activatedRoute.queryParams.subscribe(() => {
        const { page, id, q } = queryString()
        this.page = page
        this.id = id
        this.searchKeyword = q
        this.sliceMax = 0
        if (q) {
          this.currentList = fuzzySearch(this.websiteList, q)
        } else {
          this.currentList = matchCurrentList()
        }
        setTimeout(() => {
          this.sliceMax = Number.MAX_SAFE_INTEGER
        }, 100)
      })
    }
    if (window.__FINISHED__) {
      init()
    } else {
      event.on('WEB_FINISH', () => {
        init()
      })
    }
  }

  ngOnInit() {}

  handleSidebarNav(index: number) {
    const { page } = queryString()
    this.router.navigate(['/app'], {
      queryParams: {
        page,
        id: index,
      },
    })
  }

  handleCilckNav(index: number) {
    this.router.navigate(['/app'], {
      queryParams: {
        page: index,
      },
    })
    this.open = !this.open
  }

  handleToggleOpen() {
    this.open = !this.open
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }
}
