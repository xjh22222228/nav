// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core'
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
import { setWebsiteList, updateByClass, pushDataByAny } from 'src/utils/web'
import { getClassById } from 'src/utils/index'
import { getTempId, isSelfDevelop } from 'src/utils/utils'
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
  @ViewChild('input', { static: false }) input!: ElementRef

  readonly $t = $t
  validateForm!: FormGroup
  showModal = false
  isEdit = false
  submitting = false

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
      this.validateForm.get('id')!.setValue(props['id'] || getTempId())
      this.validateForm.get('ownVisible')!.setValue(!!props['ownVisible'])
      this.showModal = true
      this.focusUrl()
    }
    event.on('EDIT_CLASS_OPEN', handleOpen)
  }

  get iconUrl(): string {
    return this.validateForm.get('icon')?.value || ''
  }

  focusUrl() {
    setTimeout(() => {
      this.input?.nativeElement?.focus()
    }, 400)
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
    title = title.trim()
    if (!title) {
      this.message.error('Cannot be empty')
      return
    }
    const params: Record<string, any> = {
      id,
      title,
      icon,
      ownVisible,
    }

    try {
      this.submitting = true
      if (this.isEdit) {
        const ok = updateByClass(id, params)
        ok && this.message.success($t('_modifySuccess'))
      } else {
        params['id'] = getTempId()
        params['nav'] = []

        const { oneIndex, twoIndex } = getClassById(id, -1)
        if (oneIndex !== -1 || twoIndex !== -1) {
          const ok = pushDataByAny(id, params)
          ok && this.message.success($t('_addSuccess'))
        } else {
          websiteList.push(params as any)
          setWebsiteList(websiteList)
        }
      }
    } catch (error: any) {
      this.message.error(error.message)
    } finally {
      this.submitting = false
    }

    this.onOk.emit(params)
    this.onCancel()
    if (!isSelfDevelop) {
      event.emit('WEB_REFRESH')
    }
  }
}
