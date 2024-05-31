// @ts-nocheck
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
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { websiteList, settings } from 'src/store'

@Component({
  selector: 'app-light',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class LightComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  isLogin = isLogin
  sliceMax = 1
  settings = settings

  ngOnInit() {
    randomBgImg()

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
      }, 100)
    })
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

  ngAfterViewInit() {}

  onCollapse = (item: any, index: number) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }
}
