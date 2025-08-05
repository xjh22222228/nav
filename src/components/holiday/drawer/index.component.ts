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
import { NzSelectModule } from 'ng-zorro-antd/select'
import { getHoliday } from 'src/api'
import dayjs from 'dayjs'

interface IHolidayProps {
  date: string
  title: string
  day: number | string
  label?: string
}

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
    NzSelectModule,
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
  holidays: Required<IHolidayProps>[] = []
  holidayValue = []
  loading = false

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
            url: item.url || '', // 预留
            day: String(item.day),
            title: item.title,
            date: item.date,
          }),
        )
      })
    }
    this.visible = true
  }

  getHoliday() {
    this.loading = true
    getHoliday()
      .then((res) => {
        const { data } = res.data
        this.holidays = data.map((item: IHolidayProps) => {
          item.label = `${item.title} (${item.date})（${item.day}）`
          return item
        })
      })
      .finally(() => {
        this.loading = false
      })
  }

  handleHolidayChange(values: IHolidayProps[]) {
    for (const value of values) {
      const items = this.items.value as IHolidayProps[]
      const existingItem = items.some((item) => item.date === value.date)
      if (!existingItem) {
        ;(this.validateForm.get('items') as FormArray).push(
          this.fb.group({
            url: '',
            day: value.day,
            title: value.title,
            date: value.date,
          }),
        )
      }
    }
  }

  handleAdd() {
    ;(this.validateForm.get('items') as FormArray).push(
      this.fb.group({
        day: '0',
        url: '',
        title: '',
        date: Date.now(),
      }),
    )
  }

  handleDel(idx: number) {
    ;(this.validateForm.get('items') as FormArray).removeAt(idx)
  }

  handleClose() {
    this.visible = false
    ;(this.validateForm.get('items') as FormArray).controls = []
  }

  handleSubmit() {
    const values = this.validateForm.value
    const format = 'YYYY-MM-DD'
    const now = dayjs(dayjs().format(format))
    this.ok.emit({
      ...values,
      items: [...values.items]
        .filter((item: IHolidayProps) => {
          const day = parseInt(item.day as string)
          item.day = day || 0
          item.date = dayjs(item.date).format(format)
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
