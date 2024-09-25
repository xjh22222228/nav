// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import dayjs from 'dayjs'

@Component({
  selector: 'countdown-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CountdownDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      topColor: [''],
      bgColor: [''],
      title: [''],
      url: [''],
      dateColor: [''],
      dayColor: [''],
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

  onUploadImage(data: any) {
    this.validateForm.get('url')!.setValue(data.cdn)
  }

  handleClose() {
    this.visible = false
  }

  handleSubmit() {
    const values = this.validateForm.value
    this.ok.emit({
      ...values,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      index: this.index,
    })
    this.handleClose()
  }
}
