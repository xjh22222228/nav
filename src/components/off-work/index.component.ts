// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { IComponentProps } from 'src/types'
import { $t } from 'src/locale'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-offwork',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class OffWorkComponent {
  @Input() data!: IComponentProps

  countdownStr = ''
  isRest = false
  private timer: any

  constructor() {
    document.addEventListener(
      'visibilitychange',
      this.visibilitychange.bind(this)
    )
  }

  ngOnChanges() {
    clearTimeout(this.timer)
    this.init()
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
    document.removeEventListener('visibilitychange', this.visibilitychange)
  }

  private visibilitychange(e: any) {
    if (e.target.hidden) {
      clearTimeout(this.timer)
    } else {
      this.init()
    }
  }

  private init() {
    if (this.data) {
      const now = new Date()
      const nowTime = now.getTime()
      const startDate = new Date(this.data['startDate'])
      startDate.setFullYear(now.getFullYear())
      startDate.setMonth(now.getMonth())
      startDate.setDate(now.getDate())
      const startTime = startDate.getTime()
      const date = new Date(this.data['date'])
      date.setFullYear(now.getFullYear())
      date.setMonth(now.getMonth())
      date.setDate(now.getDate())
      const dateTime = date.getTime()
      const diffTime = (dateTime - nowTime) / 1000
      const hours = diffTime / (60 * 60)
      const decimal = Math.floor((hours % 1) * 10) / 10
      const minutes = Math.floor((diffTime / 60) % 60)
      const seconds = Math.floor(diffTime % 60)
      const hoursDecimal = Math.floor(hours) + decimal

      if (nowTime >= startTime && nowTime <= dateTime) {
        if (hoursDecimal >= 1) {
          this.countdownStr = $t('_hours', { num: hoursDecimal })
        } else if (minutes > 0) {
          this.countdownStr = $t('_minutes', { num: minutes })
        } else if (seconds >= 0) {
          this.countdownStr = $t('_seconds', { num: seconds })
        }
      } else {
        this.isRest = true
        return clearTimeout(this.timer)
      }
      this.isRest = false
    }
    this.timer = setTimeout(() => this.init(), 1000)
  }
}
