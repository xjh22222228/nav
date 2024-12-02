// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import event from 'src/utils/mitt'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { LogoComponent } from 'src/components/logo/logo.component'
import { UploadComponent } from 'src/components/upload/index.component'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    LogoComponent,
    UploadComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'edit-category',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class EditCategoryComponent {
  @Output() onOk = new EventEmitter()
  @Input() title: string = $t('_edit')

  $t = $t
  validateForm!: FormGroup
  showModal = false

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      icon: [''],
      ownVisible: [false],
    })
    event.on('EDIT_CATEGORY_OPEN', (props: any = {}) => {
      this.validateForm.get('title')!.setValue(props['title'] || '')
      this.validateForm.get('icon')!.setValue(props['icno'] || '')
      this.validateForm.get('ownVisible')!.setValue(!!props['ownVisible'])
      this.showModal = true
    })
  }

  ngOnInit() {}

  get iconUrl(): string {
    return this.validateForm.get('icon')?.value || ''
  }

  onChangeFile(data: any) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  onCancel() {
    this.validateForm.reset()
    this.showModal = false
  }

  handleOk() {
    let { title, icon, ownVisible } = this.validateForm.value
    if (!title || !title.trim()) {
      this.message.error('Cannot be empty')
      return
    }
    title = title.trim()

    this.onOk.emit({
      title,
      icon,
      ownVisible,
    })
    this.onCancel()
  }
}
