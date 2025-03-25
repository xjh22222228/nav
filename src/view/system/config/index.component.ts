// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzSliderModule } from 'ng-zorro-antd/slider'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { getConfigInfo, updateConfigInfo } from 'src/api'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzSelectModule,
    NzPopoverModule,
    NzTabsModule,
    NzButtonModule,
    NzFormModule,
    NzSliderModule,
    NzInputModule,
    NzSwitchModule,
    NzTableModule,
    NzRadioModule,
    NzCheckboxModule,
    NzPopconfirmModule,
  ],
  selector: 'system-config',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemConfigComponent {
  readonly $t = $t
  readonly textareaSize = { minRows: 5, maxRows: 20 }
  validateForm!: FormGroup
  submitting: boolean = false

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      password: [''],
      address: [''],
      XFAPIPassword: [''],
      mailConfig: [''],
      hashMode: [false],
    })
  }

  ngOnInit() {
    this.getConfigInfo()
  }

  private getConfigInfo() {
    this.submitting = true
    getConfigInfo()
      .then((res) => {
        const { data } = res
        this.validateForm.get('password')!.setValue(data.password || '')
        this.validateForm.get('address')!.setValue(data.address || '')
        this.validateForm
          .get('mailConfig')!
          .setValue(JSON.stringify(data.mailConfig, null, 2) || '')
        this.validateForm
          .get('XFAPIPassword')!
          .setValue(data.XFAPIPassword || '')
        this.validateForm.get('hashMode')!.setValue(data.hashMode || false)
      })
      .finally(() => {
        this.submitting = false
      })
  }

  async handleSubmit() {
    if (this.submitting) {
      return
    }

    try {
      this.submitting = true
      const params = {
        ...this.validateForm.value,
        mailConfig: JSON.parse(
          this.validateForm.get('mailConfig')?.value || '{}'
        ),
      }

      await updateConfigInfo(params)
      this.message.success($t('_saveSuccess'))
      setTimeout(() => {
        location.reload()
      }, 2000)
    } catch (error) {
      this.notification.error('Error', (error as Error).message)
    } finally {
      this.submitting = false
    }
  }
}
