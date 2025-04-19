// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { NzDrawerModule } from 'ng-zorro-antd/drawer'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import dayjs from 'dayjs'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
  ],
  selector: 'holiday-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class HolidayDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  readonly $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      items: this.fb.array([]),
    })
  }

  get items(): FormArray {
    return this.validateForm.get('items') as FormArray
  }

  open(data: any, idx: number) {
    this.index = idx
    if (data['items']) {
      data['items'].forEach((item: any) => {
        ;(this.validateForm.get('items') as FormArray).push(
          this.fb.group({
            url: item.url || '',
            day: String(item.day),
            title: item.title,
            date: item.date,
          })
        )
      })
    }
    this.visible = true
  }

  handleAdd() {
    ;(this.validateForm.get('items') as FormArray).push(
      this.fb.group({
        day: '0',
        url: '',
        title: '',
        date: Date.now(),
      })
    )
  }

  handleClose() {
    this.visible = false
    ;(this.validateForm.get('items') as FormArray).controls = []
  }

  handleSubmit() {
    const values = this.validateForm.value
    const now = dayjs(dayjs().format('YYYY-MM-DD'))
    this.ok.emit({
      ...values,
      items: [...values.items]
        .filter((item: any) => {
          const day = parseInt(item.day)
          item.day = day || 0
          item.date = dayjs(item.date).format('YYYY-MM-DD')
          let date = dayjs(item.date)
          if (item.day > 0) {
            date = date.add(item.day - 1, 'day')
          }
          if (date.isBefore(now)) {
            return false
          }
          return !!item.title.trim()
        })
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()),
      index: this.index,
    })
    this.handleClose()
  }
}
