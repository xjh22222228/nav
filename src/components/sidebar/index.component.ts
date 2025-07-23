// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import type { INavProps, INavTwoProp } from 'src/types'
import { CommonModule } from '@angular/common'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { CommonService } from 'src/services/common'
import { navs } from 'src/store'
import { settings } from 'src/store'
import { STORAGE_KEY_MAP } from 'src/constants'
import { isMobile, isDark } from 'src/utils'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { LogoComponent } from 'src/components/logo/logo.component'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import event from 'src/utils/mitt'

function getDefaultCollapsed(): boolean {
  if (isMobile()) {
    return false
  }
  const localCollapsed = localStorage.getItem(STORAGE_KEY_MAP.SIDE_COLLAPSED)
  if (localCollapsed) {
    return localCollapsed === 'true'
  }
  return settings().sideCollapsed
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    LogoComponent,
    NzMenuModule,
    NzLayoutModule,
  ],
  selector: 'app-sidebar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [],
})
export class SidebarComponent {
  @Input() showTop: boolean = true

  navs: INavProps[] = navs()
  isDark = isDark()
  isCollapsed = getDefaultCollapsed()
  openSidebar = false
  menuOpenId = 0

  constructor(public commonService: CommonService) {
    this.menuOpenId = this.navs[commonService.oneIndex]?.id || 0

    event.on('EVENT_DARK', (isDark: unknown) => {
      this.isDark = isDark as boolean
    })
  }

  get logoImage() {
    return this.isDark
      ? this.commonService.settings().darkLogo ||
          this.commonService.settings().logo
      : this.commonService.settings().logo ||
          this.commonService.settings().darkLogo
  }

  openMenu(item: INavProps) {
    this.menuOpenId = item.id
  }

  toggleSidebar(openSidebar?: boolean) {
    this.openSidebar = openSidebar ?? !this.openSidebar
    if (this.openSidebar) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }

  handleCollapsed() {
    this.isCollapsed = !this.isCollapsed
    localStorage.setItem(
      STORAGE_KEY_MAP.SIDE_COLLAPSED,
      String(this.isCollapsed),
    )
    setTimeout(() => {
      event.emit('COMPONENT_CHECK_OVER')
    }, 300)
  }

  onClickNav(item: INavTwoProp) {
    this.commonService.handleClickClass(item.id)
    this.toggleSidebar(false)
  }
}
