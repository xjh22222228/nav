// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { components } from 'src/store'
import { ComponentType, IComponentProps } from 'src/types'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-offwork',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class OffWorkComponent {
  @Input() data!: IComponentProps

  countdownStr = ''
  isRest = false
  timer: any
  component: Record<string, any> = {}

  constructor() {
    document.addEventListener(
      'visibilitychange',
      this.visibilitychange.bind(this)
    )
  }

  ngOnInit() {
    this.init()
    event.on('COMPONENT_OK', () => {
      clearTimeout(this.timer)
      this.init()
    })
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
    const component = components.find(
      (item) => item.type === ComponentType.OffWork && item.id === this.data?.id
    )
    if (component) {
      this.component = component
      const now = new Date()
      const nowTime = now.getTime()
      const startDate = new Date(component['startDate'])
      startDate.setFullYear(now.getFullYear())
      startDate.setMonth(now.getMonth())
      startDate.setDate(now.getDate())
      const startTime = startDate.getTime()
      const date = new Date(component['date'])
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
          this.countdownStr = `${hoursDecimal}小时`
        } else if (minutes > 0) {
          this.countdownStr = `${minutes}分钟`
        } else if (seconds >= 0) {
          this.countdownStr = `${seconds}秒`
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
