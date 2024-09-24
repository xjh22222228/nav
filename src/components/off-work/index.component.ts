// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { components } from 'src/store'
import { ComponentType } from 'src/types'

@Component({
  selector: 'app-offwork',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class OffWorkComponent {
  countdownStr = ''
  isRest = false
  timer: any
  data: Record<string, any> = {}

  constructor() {
    this.init()
    document.addEventListener(
      'visibilitychange',
      this.visibilitychange.bind(this)
    )
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
    document.removeEventListener('visibilitychange', this.visibilitychange)
  }

  visibilitychange(e: any) {
    if (e.target.hidden) {
      clearTimeout(this.timer)
    } else {
      this.init()
    }
  }

  init() {
    const data = components.find((item) => item.type === ComponentType.OffWork)
    if (data) {
      this.data = data
      const now = new Date()
      const date = new Date(data.date)
      date.setFullYear(now.getFullYear())
      date.setMonth(now.getMonth())
      date.setDate(now.getDate())
      const diffTime = (date.getTime() - now.getTime()) / 1000
      const hours = Math.floor(diffTime / (60 * 60))
      const minutes = Math.floor((diffTime / 60) % 60)
      const seconds = Math.floor(diffTime % 60)
      if (diffTime <= 0) {
        this.isRest = true
        return clearTimeout(this.timer)
      } else if (hours > 0) {
        this.countdownStr = `${hours}小时`
      } else if (minutes > 0) {
        this.countdownStr = `${minutes}分钟`
      } else if (seconds >= 0) {
        this.countdownStr = `${seconds}秒`
      }
      this.isRest = false
    }
    this.timer = setTimeout(() => this.init(), 1000)
  }
}
