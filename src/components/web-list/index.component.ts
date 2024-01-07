// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { websiteList } from 'src/store'
import { INavFourProp, INavProps } from 'src/types'
import { setWebsiteList, queryString, fuzzySearch } from 'src/utils'
import { isLogin } from 'src/utils/user'
import { ActivatedRoute } from '@angular/router'

let DEFAULT_WEBSITE = []

@Component({
  selector: 'app-web-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class WebListComponent implements OnInit {
  @Input() max: number = 110

  websiteList: INavProps[] = websiteList
  dataList: INavFourProp[] = []

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.getTopWeb()

    this.activatedRoute.queryParams.subscribe(() => {
      const { q } = queryString()
      const result = fuzzySearch(this.websiteList, q)

      if (q.trim()) {
        if (result.length === 0) {
          this.dataList = [];
        } else {
          this.dataList = result[0].nav.slice(0, this.max);
        }
      } else {
        this.dataList = DEFAULT_WEBSITE
      }
      setWebsiteList(this.websiteList)
    })
  }

  // 获取置顶WEB
  getTopWeb() {
    const dataList: INavFourProp[] = []
    const max = this.max

    function r(nav) {
      if (!Array.isArray(nav)) return
  
      for (let i = 0; i < nav.length; i++) {
        if (dataList.length > max) {
          break
        }

        const item = nav[i]
        if (item.url) {
          if (item.top && (isLogin || !item.ownVisible)) {
            dataList.push(item)
          }
        } else {
          r(item.nav)
        }
      }
    }
    r(websiteList)

    this.dataList = dataList.sort((a, b) => a.index - b.index)
    DEFAULT_WEBSITE = this.dataList
  }

  handleDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.dataList, event.previousIndex, event.currentIndex)

    const m = {}

    for (let i = 1; i <= this.dataList.length; i++) {
      const item = this.dataList[i - 1]
      m[`${item.name}${item.url}`] = i
    }

    function r(nav) {
      if (!Array.isArray(nav)) return
  
      for (let i = 0; i < nav.length; i++) {
        const item = nav[i]
        if (item.url) {
          const k = `${item.name}${item.url}`
          if (m[k]) {
            item.index = m[k]
          }
        } else {
          r(item.nav)
        }
      }
    }
    r(websiteList)
    setWebsiteList(websiteList)
  }

  goUrl(url) {
    window.open(url)
  }
}
