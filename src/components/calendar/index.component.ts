// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { getDateTime, getDayOfYear } from 'src/utils'
import { IComponentProps } from 'src/types'

@Component({
  selector: 'app-calendar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CalendarComponent {
  @Input() data!: IComponentProps

  date = ''
  day = 0
  week = ''
  dayOfYear = 0

  constructor() {
    const date = getDateTime()
    this.date = `${date.year}年${date.month}月`
    this.day = date.date
    this.week = date.dayText
    this.dayOfYear = getDayOfYear()
  }
}
