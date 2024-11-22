// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { INavProps } from 'src/types'
import { isMobile } from 'src/utils'
import { setWebsiteList } from 'src/utils/web'
import { websiteList } from 'src/store'
import { settings } from 'src/store'
import { $t } from 'src/locale'
import { CommonService } from 'src/services/common'
import { STORAGE_KEY_MAP } from 'src/constants'
import { isSelfDevelop } from 'src/utils/util'
import { ComponentGroupComponent } from 'src/components/component-group/index.component'
import { SearchEngineComponent } from 'src/components/search-engine/search-engine.component'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { CardComponent } from 'src/components/card/index.component'
import { NoDataComponent } from 'src/components/no-data/no-data.component'
import { FooterComponent } from 'src/components/footer/footer.component'
import { FixbarComponent } from 'src/components/fixbar/index.component'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { SwiperComponent } from 'src/components/swiper/index.component'
import { ToolbarTitleWebComponent } from 'src/components/toolbar-title/index.component'
import { WebListComponent } from 'src/components/web-list/index.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzMenuModule,
    WebListComponent,
    ToolbarTitleWebComponent,
    ComponentGroupComponent,
    SearchEngineComponent,
    NzSpinModule,
    NzToolTipModule,
    CardComponent,
    NoDataComponent,
    FooterComponent,
    FixbarComponent,
    NzGridModule,
    NzLayoutModule,
    SwiperComponent,
  ],
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

  get nzXXl(): number {
    const cardStyle = this.commonService.settings.sideCardStyle
    if (cardStyle === 'original' || cardStyle === 'example') {
      return 4
    }
    return 6
  }

  openMenu(item: any, index: number) {
    this.websiteList.forEach((data, idx) => {
      if (idx === index) {
        data.collapsed = !data.collapsed
      } else {
        data.collapsed = false
      }
    })
    if (!isSelfDevelop) {
      setWebsiteList(this.websiteList)
    }
  }

  handleCollapsed() {
    this.isCollapsed = !this.isCollapsed
    localStorage.setItem(
      STORAGE_KEY_MAP.sideCollapsed,
      String(this.isCollapsed)
    )
  }
}
