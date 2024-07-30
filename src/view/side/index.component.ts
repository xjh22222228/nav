// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
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
  matchCurrentList,
  isMobile,
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { websiteList } from 'src/store'
import { settings, searchEngineList } from 'src/store'
import { $t } from 'src/locale'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-side',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SideComponent {
  $t = $t
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  title: string = settings.title.trim().split(/\s/)[0]
  searchEngineList = searchEngineList
  isLogin = isLogin
  settings = settings
  sliceMax = 0
  searchKeyword = ''
  isCollapsed = isMobile() ? true : settings.sideCollapsed

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

  ngOnInit() {}

  handleSidebarNav(page: any, id: any) {
    this.websiteList[page].id = id
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page,
        id,
      },
    })
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
  }

  collapsed() {
    try {
      return !!websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }
}
