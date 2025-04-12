// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Injectable } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { websiteList, settings } from 'src/store'
import {
  queryString,
  fuzzySearch,
  matchCurrentList,
  getOverIndex,
  getClassById,
} from 'src/utils'
import { setWebsiteList, toggleCollapseAll } from 'src/utils/web'
import type { INavProps, INavThreeProp } from 'src/types'
import { isLogin, getPermissions } from 'src/utils/user'
import { isSelfDevelop } from 'src/utils/utils'
import event from 'src/utils/mitt'

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  readonly isLogin = isLogin
  readonly settings = settings
  readonly permissions = getPermissions(settings)
  readonly title: string = settings.title.trim().split(/\s/)[0]
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  twoIndex = 0
  oneIndex = 0
  sliceMax = 0
  selectedThreeIndex = 0 // 第三级菜单选中
  searchKeyword = ''
  overIndex = Number.MAX_SAFE_INTEGER

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const getData = () => {
      const { id, q } = queryString()
      const { oneIndex, twoIndex, threeIndex } = getClassById(id)
      this.oneIndex = oneIndex
      this.twoIndex = twoIndex
      this.selectedThreeIndex = threeIndex
      this.searchKeyword = q

      if (q) {
        this.currentList = fuzzySearch(websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }
    }

    const init = () => {
      this.activatedRoute.queryParams.subscribe(() => {
        this.sliceMax = 0
        getData()
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
    event.on('WEB_REFRESH', () => {
      getData()
    })
  }

  handleClickClass(id: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        id,
        _: Date.now(),
      },
    })
    event.emit('SEARCH_FOCUS')
  }

  onCollapseAll = (e?: Event) => {
    e?.stopPropagation()
    toggleCollapseAll(websiteList)
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }

  get collapsed() {
    try {
      return !!websiteList[this.oneIndex].nav[this.twoIndex].collapsed
    } catch {
      return false
    }
  }

  onCollapse = (item: INavThreeProp) => {
    item.collapsed = !item.collapsed
    if (!isSelfDevelop) {
      setWebsiteList(this.websiteList)
    }
  }

  getOverIndex(selector: string) {
    queueMicrotask(() => {
      const overIndex = getOverIndex(selector)
      if (this.overIndex === overIndex) {
        return
      }
      this.overIndex = overIndex
    })
  }

  setOverIndex() {
    this.overIndex = Number.MAX_SAFE_INTEGER
  }
}
