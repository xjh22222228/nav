// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { websiteList } from 'src/store'
import { IWebProps, INavProps } from 'src/types'
import { queryString, fuzzySearch, isMobile } from 'src/utils'
import { isLogin } from 'src/utils/user'
import { ActivatedRoute } from '@angular/router'
import { ServiceCommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'
import event from 'src/utils/mitt'

let DEFAULT_WEBSITE: Array<IWebProps> = []

@Component({
  selector: 'app-web-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class WebListComponent {
  @Input() type: 'dock' | '' = ''
  @Input() dockCount = 4
  @Input() size: 'large' | '' = ''
  @Input() max: number = 110
  @Input() search = true
  @Input() overflow = false

  websiteList: INavProps[] = websiteList
  dataList: IWebProps[] = []

  constructor(
    public jumpService: JumpService,
    private activatedRoute: ActivatedRoute,
    public serviceCommon: ServiceCommonService
  ) {}

  ngOnInit() {
    const init = () => {
      this.getTopWeb()
      this.activatedRoute.queryParams.subscribe(() => {
        const { q } = queryString()
        const result = fuzzySearch(this.websiteList, q)

        if (this.search && q.trim()) {
          if (result.length === 0) {
            this.dataList = []
          } else {
            this.dataList = result[0].nav.slice(0, this.max)
          }
        } else {
          this.dataList = DEFAULT_WEBSITE
        }
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

  // 获取置顶WEB
  getTopWeb() {
    const dataList: IWebProps[] = []
    const max = this.max
    let dockList: IWebProps[] = []

    function r(nav: any) {
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

    // @ts-ignore
    this.dataList = dataList.sort((a: any, b: any) => {
      const aIdx = a.index == null || a.index === '' ? 100000 : a.index
      const bIdx = b.index == null || b.index === '' ? 100000 : b.index
      return aIdx - bIdx
    })
    if (this.type === 'dock') {
      const dockCount = isMobile() ? 5 : this.dockCount
      dockList = this.dataList.slice(0, dockCount)
      event.emit('DOCK_LIST', dockList)
      this.dataList = this.dataList.slice(dockCount)
    }
    DEFAULT_WEBSITE = this.dataList
  }
}
