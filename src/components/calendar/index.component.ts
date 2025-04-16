// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { getDateTime, getDayOfYear } from 'src/utils'
import type { IComponentItemProps } from 'src/types'
import { $t } from 'src/locale'
import { component } from 'src/store'

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CalendarComponent {
  @Input() data!: IComponentItemProps

  readonly component = component
  date = ''
  day = ''
  week = ''
  dayOfYear = ''

  constructor() {
    const date = getDateTime()
    this.date = $t('_calendarDate', { year: date.year, month: date.month })
    this.day = date.zeroDate
    this.week = date.dayText
    this.dayOfYear = $t('_dayOfYear', { day: getDayOfYear() })
  }
}
