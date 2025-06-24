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
import { UploadImageComponent } from 'src/components/upload-image/index.component'
import { NzSliderModule } from 'ng-zorro-antd/slider'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { CODE_SYMBOL } from 'src/constants/symbol'

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
    UploadImageComponent,
    NzSliderModule,
    NzSelectModule,
  ],
  selector: 'carousel-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CarouselDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  readonly $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      imgs: this.fb.array([]),
      width: [200],
      fit: ['cover'],
    })
  }

  get imgs(): FormArray {
    return this.validateForm.get('imgs') as FormArray
  }

  onUploadImage(data: any, idx: number) {
    const imgGroup = this.imgs.at(idx)
    imgGroup.patchValue({
      img: data.cdn,
    })
  }

  open(data: any, idx: number) {
    this.index = idx
    this.validateForm.get('width')?.setValue(data['width'])
    this.validateForm.get('fit')?.setValue(data['fit'])
    if (data['imgs']) {
      data['imgs'].forEach((item: any) => {
        ;(this.validateForm.get('imgs') as FormArray).push(
          this.fb.group({
            url: item.url || '',
            src: item.src || '',
          }),
        )
      })
    }
    this.visible = true
  }

  handleAdd() {
    ;(this.validateForm.get('imgs') as FormArray).push(
      this.fb.group({
        url: '',
        src: '',
      }),
    )
  }

  handleClose() {
    this.visible = false
    ;(this.validateForm.get('imgs') as FormArray).controls = []
  }

  handleSubmit() {
    const values = this.validateForm.value
    this.ok.emit({
      ...values,
      imgs: [...values.imgs].filter((item: any) => {
        return item.src || item.url[0] === CODE_SYMBOL
      }),
      index: this.index,
    })
    this.handleClose()
  }
}
