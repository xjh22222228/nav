// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { LogoComponent } from 'src/components/logo/logo.component'
import { UploadComponent } from 'src/components/upload/index.component'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { websiteList } from 'src/store'
import { setWebsiteList } from 'src/utils/web'
import { getClassById } from 'src/utils/index'
import event from 'src/utils/mitt'

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
  selector: 'edit-class',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class EditClassComponent {
  @Output() onOk = new EventEmitter()

  $t = $t
  validateForm!: FormGroup
  showModal = false
  isEdit = false

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      icon: [''],
      ownVisible: [false],
      id: [-1],
    })
    const handleOpen = (props: any = {}) => {
      this.isEdit = !!props['title']
      this.validateForm.get('title')!.setValue(props['title'] || '')
      this.validateForm.get('icon')!.setValue(props['icon'] || '')
      this.validateForm.get('id')!.setValue(props['id'] || -Date.now())
      this.validateForm.get('ownVisible')!.setValue(!!props['ownVisible'])
      this.showModal = true
    }
    event.on('EDIT_CLASS_OPEN', handleOpen)
  }

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
    let { title, icon, ownVisible, id } = this.validateForm.value
    if (!title || !title.trim()) {
      this.message.error('Cannot be empty')
      return
    }
    title = title.trim()
    const params: Record<string, any> = {
      id,
      title,
      icon,
      ownVisible,
    }

    try {
      if (this.isEdit) {
        const { oneIndex, twoIndex, threeIndex } = getClassById(id, -1)
        if (threeIndex !== -1) {
          websiteList[oneIndex].nav[twoIndex].nav[threeIndex] = {
            ...websiteList[oneIndex].nav[twoIndex].nav[threeIndex],
            ...params,
          }
        } else if (twoIndex !== -1) {
          websiteList[oneIndex].nav[twoIndex] = {
            ...websiteList[oneIndex].nav[twoIndex],
            ...params,
          }
        } else {
          websiteList[oneIndex] = {
            ...websiteList[oneIndex],
            ...params,
          }
        }
      } else {
        params['id'] = -Date.now()
        params['nav'] = []
        const { oneIndex, twoIndex } = getClassById(id, -1)
        if (twoIndex !== -1) {
          websiteList[oneIndex].nav[twoIndex].nav.push(params as any)
        } else if (oneIndex !== -1) {
          websiteList[oneIndex].nav.push(params as any)
        } else {
          websiteList.push(params as any)
        }
      }
      setWebsiteList(websiteList)
    } catch (error: any) {
      this.message.error(error.message)
    }

    this.onOk.emit(params)
    this.onCancel()
  }
}
