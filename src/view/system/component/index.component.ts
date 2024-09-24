// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, ViewChild } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { updateFileContent } from 'src/api'
import { COMPONENT_PATH } from 'src/constants'
import { components } from 'src/store'
import { ComponentType } from 'src/types'
import { CalendarDrawerComponent } from 'src/components/calendar/calendar-drawer/index.component'
import { RuntimeDrawerComponent } from 'src/components/runtime/runtime-drawer/index.component'
import { OffWorkDrawerComponent } from 'src/components/off-work/offwork-drawer/index.component'
import { componentTitleMap } from './types'

@Component({
  selector: 'system-component',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemComponentComponent {
  @ViewChild('calendar') calendarChild!: CalendarDrawerComponent
  @ViewChild('runtime') runtimeChild!: RuntimeDrawerComponent
  @ViewChild('offwork') offworkChild!: OffWorkDrawerComponent

  $t = $t
  componentTitleMap = componentTitleMap
  ComponentType = ComponentType
  components = components
  submitting: boolean = false

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {}

  // 上移
  moveUp(index: number): void {
    if (index === 0) {
      return
    }
    const current = this.components[index]
    const prev = this.components[index - 1]
    this.components[index - 1] = current
    this.components[index] = prev
  }

  // 下移
  moveDown(index: number): void {
    if (index === this.components.length - 1) {
      return
    }
    const current = this.components[index]
    const next = this.components[index + 1]
    this.components[index + 1] = current
    this.components[index] = next
  }

  handleEdit(data: any, idx: number) {
    const type = data.type
    const types: Record<string, any> = {
      1: this.calendarChild,
      2: this.offworkChild,
      3: this.runtimeChild,
    }
    types[type]?.open(data, idx)
  }

  handleOk(data: any) {
    const { index, ...values } = data
    this.components[index] = {
      ...this.components[index],
      ...values,
    }
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.submitting = true
        updateFileContent({
          message: 'update component',
          content: JSON.stringify(this.components),
          path: COMPONENT_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  trackByItem(i: number, item: any) {
    return item.type
  }
}
