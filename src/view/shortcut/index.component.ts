// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgStyle } from '@angular/common'
import { isDark as isDarkFn, getDateTime, isMobile } from 'src/utils'
import { settings } from 'src/store'
import type { IWebProps } from 'src/types'
import { JumpService } from 'src/services/jump'
import { $t } from 'src/locale'
import { SearchComponent } from 'src/components/search/index.component'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { FixbarComponent } from 'src/components/fixbar/index.component'
import { WebListComponent } from 'src/components/web-list/index.component'
import { LogoComponent } from 'src/components/logo/logo.component'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgStyle,
    SearchComponent,
    NzToolTipModule,
    FixbarComponent,
    WebListComponent,
    LogoComponent,
  ],
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class ShortcutComponent {
  readonly $t = $t
  readonly settings = settings
  readonly isMobile = isMobile()
  readonly shortcutThemeImage = settings.shortcutThemeImages?.[0]?.['src']
  isDark: boolean = isDarkFn()
  timer: any = null
  month = 0
  date = 0
  hours = ''
  minutes = ''
  seconds = ''
  dayText = ''
  dockList: IWebProps[] = []
  iconSize: number = 0
  frameLoad = false

  constructor(public jumpService: JumpService) {
    event.on('EVENT_DARK', (isDark: any) => {
      this.isDark = isDark
    })
    event.on('DOCK_LIST', (dockList: any) => {
      this.dockList = dockList
    })
    this.getDateTime()
  }

  ngOnInit() {
    document.addEventListener('visibilitychange', (e: any) => {
      const hide = e.target.hidden
      if (hide) {
        clearTimeout(this.timer)
      } else {
        this.getDateTime()
      }
    })
  }

  handleMouseLeave(e: any) {
    try {
      const imgs = e.currentTarget.querySelectorAll('.common-icon')
      if (this.iconSize !== 0) {
        imgs.forEach((el: HTMLImageElement) => {
          el.style.width = `${this.iconSize}px`
          el.style.height = `${this.iconSize}px`
        })
      }
    } catch (error) {}
  }

  handleMouseOver(e: any) {
    if (this.isMobile) {
      return
    }

    try {
      const imgs = e.currentTarget.querySelectorAll('.common-icon')
      if (!imgs.length) {
        return
      }

      const nodeName = e.target.nodeName
      if (nodeName === 'APP-LOGO' || nodeName === 'div') {
        if (this.iconSize === 0) {
          this.iconSize = imgs[0].clientWidth
        }
        const index = Number(e.target.dataset.index)
        imgs.forEach((el: HTMLImageElement) => {
          el.style.width = `${this.iconSize}px`
          el.style.height = `${this.iconSize}px`
        })
        const largeSize = this.iconSize * 1.4
        imgs[index].style.width = `${largeSize}px`
        imgs[index].style.height = `${largeSize}px`
        const middleSize = this.iconSize * 1.2
        const smallSize = this.iconSize * 1.04
        if (imgs[index - 1]) {
          imgs[index - 1].style.width = `${middleSize}px`
          imgs[index - 1].style.height = `${middleSize}px`
        }
        if (imgs[index - 2]) {
          imgs[index - 2].style.width = `${smallSize}px`
          imgs[index - 2].style.height = `${smallSize}px`
        }
        if (imgs[index + 1]) {
          imgs[index + 1].style.width = `${middleSize}px`
          imgs[index + 1].style.height = `${middleSize}px`
        }
        if (imgs[index + 2]) {
          imgs[index + 2].style.width = `${smallSize}px`
          imgs[index + 2].style.height = `${smallSize}px`
        }
      }
    } catch (error) {}
  }

  getDateTime() {
    this.timer = setTimeout(() => {
      this.getDateTime()
    }, 1000)
    const { hours, minutes, seconds, month, date, dayText } = getDateTime()
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
    this.month = month
    this.date = date
    this.dayText = dayText
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }

  iframeLoad() {
    this.frameLoad = true
  }
}
