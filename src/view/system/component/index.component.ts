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
import { ComponentType, IComponentProps } from 'src/types'
import { CalendarDrawerComponent } from 'src/components/calendar/drawer/index.component'
import { RuntimeDrawerComponent } from 'src/components/runtime/drawer/index.component'
import { OffWorkDrawerComponent } from 'src/components/off-work/drawer/index.component'
import { ImageDrawerComponent } from 'src/components/image/drawer/index.component'
import { CountdownDrawerComponent } from 'src/components/countdown/drawer/index.component'
import { componentTitleMap } from './types'
import { isSelfDevelop } from 'src/utils/util'
import event from 'src/utils/mitt'

@Component({
  selector: 'system-component',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemComponentComponent {
  @ViewChild('calendar') calendarChild!: CalendarDrawerComponent
  @ViewChild('runtime') runtimeChild!: RuntimeDrawerComponent
  @ViewChild('offwork') offworkChild!: OffWorkDrawerComponent
  @ViewChild('image') imageChild!: ImageDrawerComponent
  @ViewChild('countdown') countdownChild!: CountdownDrawerComponent

  $t = $t
  isSelfDevelop = isSelfDevelop
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
      [ComponentType.Calendar]: this.calendarChild,
      [ComponentType.OffWork]: this.offworkChild,
      [ComponentType.Runtime]: this.runtimeChild,
      [ComponentType.Image]: this.imageChild,
      [ComponentType.Countdown]: this.countdownChild,
    }
    types[type]?.open(data, idx)
  }

  onAdd(data: IComponentProps) {
    let max = Math.max(...this.components.map((item) => item.id))
    max = max <= 0 ? 1 : max + 1
    this.components.push({
      ...data,
      id: max,
    })
  }

  onDelete(idx: number) {}

  handleOk(data: any) {
    const { index, ...values } = data
    this.components[index] = {
      ...this.components[index],
      ...values,
    }
    event.emit('COMPONENT_OK')
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
    return item.id
  }
}
