// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { IComponentItemProps } from 'src/types'
import { $t } from 'src/locale'
import dayjs from 'dayjs'
import { component } from 'src/store'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-holiday',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class HolidayComponent {
  @Input() data!: IComponentItemProps
  items: any[] = []

  readonly component = component
  readonly $t = $t

  constructor() {}

  ngOnChanges() {
    this.init()
  }

  private init() {
    let items: any = {}
    const now = dayjs(dayjs().format('YYYY-MM-DD'))
    if (this.data['items']) {
      items = [...this.data['items']]
        .filter((item: any) => {
          item.date = dayjs(item.date).format('YYYY-MM-DD')
          let date = dayjs(item.date)
          if (item.day > 0) {
            date = date.add(item.day - 1, 'day')
          }
          if (date.isBefore(now)) {
            return false
          }
          return true
        })
        .slice(0, 4)
        .map((item: any) => {
          item.dateStr = dayjs(item.date).format('MM.DD')
          item.diffDay = dayjs(dayjs(item.date).format('YYYY-MM-DD')).diff(
            now,
            'day'
          )
          item.diffDay = item.diffDay < 0 ? 0 : item.diffDay
          item.diffDay = item.diffDay > 999 ? 999 : item.diffDay
          item.diffStr = item.diffDay
          if (item.day > 0) {
            item.afterDay = dayjs(item.date)
              .add(item.day - 1, 'day')
              .format('MM.DD')
            if (item.afterDay === item.dateStr) {
              item.afterDay = null
            }
          }
          item.isToday = item.dateStr === dayjs().format('MM.DD')
          if (item.diffDay <= 0) {
            if (item.isToday) {
              item.diffStr = item.title
            } else {
              item.isRest = true
              item.diffStr = '休息日'
            }
          }

          return item
        })
    }
    this.items = items
  }
}
