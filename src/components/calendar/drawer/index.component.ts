// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'calendar-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CalendarDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      topColor: [''],
      bgColor: [''],
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
    this.ok.emit({
      ...values,
      index: this.index,
    })
    this.handleClose()
  }
}
