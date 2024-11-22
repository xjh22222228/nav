// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzDrawerModule } from 'ng-zorro-antd/drawer'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputModule } from 'ng-zorro-antd/input'
import { UploadComponent } from 'src/components/upload/index.component'

@Component({
  standalone: true,
  imports: [
    UploadComponent,
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
  ],
  selector: 'image-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ImageDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      url: [''],
      text: [''],
      go: [''],
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
      index: this.index,
    })
    this.handleClose()
  }
}
