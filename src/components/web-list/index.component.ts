// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { websiteList } from 'src/store'
import type { IWebProps, INavProps } from 'src/types'
import { TopType } from 'src/types'
import { queryString, fuzzySearch, isMobile, getDefaultTheme } from 'src/utils'
import { isLogin } from 'src/utils/user'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { LogoComponent } from 'src/components/logo/logo.component'
import event from 'src/utils/mitt'

let DEFAULT_WEBSITE: Array<IWebProps> = []

@Component({
  standalone: true,
  imports: [CommonModule, NzToolTipModule, NzButtonModule, LogoComponent],
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
    private router: Router,
    public jumpService: JumpService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    const init = () => {
      this.getTopWeb()
      this.activatedRoute.queryParams.subscribe(() => {
        const { q } = queryString()

        if (this.search && q.trim()) {
          const result = fuzzySearch(this.websiteList, q)
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
    let path = this.router.url.split('?')[0].replace('/', '')
    if (!path) {
      path = getDefaultTheme()
    }
    path = path[0].toUpperCase() + path.slice(1)
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
            const isMatch = (item.topTypes || []).some(
              (v: number) => path === TopType[v]
            )
            if (isMatch) {
              dataList.push(item)
            }
          }
        } else {
          r(item.nav)
        }
      }
    }
    r(websiteList)

    // @ts-ignore
    this.dataList = dataList.sort((a: any, b: any) => {
      const aIdx = a.index == null || a.index === '' ? 100000 : Number(a.index)
      const bIdx = b.index == null || b.index === '' ? 100000 : Number(b.index)
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
