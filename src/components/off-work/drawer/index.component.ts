// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'offwork-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class OffWorkDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      workTitle: [''],
      restTitle: [''],
      startDate: [null],
      date: [null],
    })
  }

  open(data: any, idx: number) {
    this.index = idx
    for (const k in data) {
      this.validateForm.get(k)!?.setValue(data[k])
    }
    this.visible = true
  }

  handleClose() {
    this.visible = false
  }

  handleSubmit() {
    const values = this.validateForm.value
    const startDate = new Date(values.startDate).getTime()
    const date = new Date(values.date).getTime()
    if (startDate >= date) {
      return this.message.error('休息时间需要比工作时间大')
    }
    this.ok.emit({
      ...values,
      startDate,
      date,
      index: this.index,
    })
    this.handleClose()
  }
}
