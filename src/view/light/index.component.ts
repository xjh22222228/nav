// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from 'src/types'
import {
  fuzzySearch,
  randomBgImg,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
  matchCurrentList,
  getOverIndex,
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { websiteList, settings } from 'src/store'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-light',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class LightComponent {
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  isLogin = isLogin
  sliceMax = 0
  settings = settings
  overIndex = Number.MAX_SAFE_INTEGER
  searchKeyword = ''

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const init = () => {
      this.activatedRoute.queryParams.subscribe(() => {
        const { id, page, q } = queryString()
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

  ngOnInit() {
    randomBgImg()
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }

  collapsed() {
    try {
      return !!websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }

  handleCilckTopNav(index: number) {
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

  ngAfterViewInit() {
    if (this.settings.lightOverType === 'ellipsis') {
      queueMicrotask(() => {
        const overIndex = getOverIndex('.top-nav .over-item')
        if (this.overIndex === overIndex) {
          return
        }
        this.overIndex = overIndex
      })
    }
  }

  onCollapse = (item: any, index: number) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }
}
