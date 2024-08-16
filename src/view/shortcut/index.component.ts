// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { isDark as isDarkFn, getDateTime } from 'src/utils'
import { settings } from 'src/store'
import { IWebProps } from 'src/types'
import { JumpService } from 'src/services/jump'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class ShortcutComponent {
  settings = settings
  isDark: boolean = isDarkFn()
  shortcutThemeImage = settings.shortcutThemeImages?.[0]?.['src']
  timer: any = null
  month = ''
  date = ''
  hours = ''
  minutes = ''
  seconds = ''
  dayText = ''
  dockList: IWebProps[] = []
  iconSize: number = 0

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
      const imgs = e.currentTarget.querySelectorAll('.dockicon')
      if (this.iconSize !== 0) {
        imgs.forEach((el: HTMLImageElement) => {
          el.style.width = `${this.iconSize}px`
          el.style.height = `${this.iconSize}px`
        })
      }
    } catch (error) {}
  }

  handleMouseOver(e: any) {
    try {
      const imgs = e.currentTarget.querySelectorAll('.dockicon')
      const nodeName = e.target.nodeName

      if (nodeName === 'IMG') {
        if (this.iconSize === 0) {
          this.iconSize = e.target.clientWidth
        }
        const index = Number(e.target.dataset.index)
        imgs.forEach((el: HTMLImageElement) => {
          el.style.width = `${this.iconSize}px`
          el.style.height = `${this.iconSize}px`
        })
        e.target.style.width = `${this.iconSize * 1.4}px`
        e.target.style.height = `${this.iconSize * 1.4}px`
        if (imgs[index - 1]) {
          imgs[index - 1].style.width = `${this.iconSize * 1.2}px`
          imgs[index - 1].style.height = `${this.iconSize * 1.2}px`
        }
        if (imgs[index - 2]) {
          imgs[index - 2].style.width = `${this.iconSize * 1.04}px`
          imgs[index - 2].style.height = `${this.iconSize * 1.04}px`
        }
        if (imgs[index + 1]) {
          imgs[index + 1].style.width = `${this.iconSize * 1.2}px`
          imgs[index + 1].style.height = `${this.iconSize * 1.2}px`
        }
        if (imgs[index + 2]) {
          imgs[index + 2].style.width = `${this.iconSize * 1.04}px`
          imgs[index + 2].style.height = `${this.iconSize * 1.04}px`
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
}
