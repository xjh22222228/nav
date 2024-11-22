// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { IComponentProps } from 'src/types'
import dayjs from 'dayjs'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  selector: 'app-countdown',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CountdownComponent {
  @Input() data!: IComponentProps
  component: Record<string, any> = {}

  constructor() {}

  ngOnInit() {
    this.init()
    event.on('COMPONENT_OK', () => {
      setTimeout(() => {
        this.init()
      }, 100)
    })
  }

  init() {
    const payload: any = {}
    if (this.data['date']) {
      payload.dateStr = dayjs(this.data['date']).format('YYYY.MM.DD')
      payload.dayStr = dayjs(
        dayjs(this.data['date']).format('YYYY-MM-DD')
      ).diff(dayjs().format('YYYY-MM-DD'), 'day')
      payload.dayStr = payload.dayStr < 0 ? 0 : payload.dayStr
      payload.dayStr = payload.dayStr > 9999 ? 9999 : payload.dayStr
    }
    this.component = payload
  }
}
