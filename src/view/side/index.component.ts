// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { INavProps } from 'src/types'
import { isMobile } from 'src/utils'
import { setWebsiteList } from 'src/utils/web'
import { websiteList } from 'src/store'
import { settings } from 'src/store'
import { $t } from 'src/locale'
import { CommonService } from 'src/services/common'
import { STORAGE_KEY_MAP } from 'src/constants'

@Component({
  selector: 'app-side',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SideComponent {
  $t = $t
  websiteList: INavProps[] = websiteList
  isCollapsed = isMobile() || settings.sideCollapsed

  constructor(public commonService: CommonService) {
    const localCollapsed = localStorage.getItem(STORAGE_KEY_MAP.sideCollapsed)
    if (localCollapsed) {
      this.isCollapsed = localCollapsed === 'true'
    }
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

  handleCollapsed() {
    this.isCollapsed = !this.isCollapsed
    localStorage.setItem(
      STORAGE_KEY_MAP.sideCollapsed,
      String(this.isCollapsed)
    )
  }
}
