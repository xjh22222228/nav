// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { SETTING_PATH } from 'src/constants'
import { updateFileContent } from 'src/services'
import { settings } from 'src/store'

@Component({
  selector: 'system-setting',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class SystemSettingComponent {
  $t = $t
  validateForm!: FormGroup;
  submitting: boolean = false
  settings = settings

  constructor (
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) {}

  ngOnInit () {
    this.validateForm = this.fb.group({
      ...settings
    })
  }

  onLogoChange(data) {
    this.settings.favicon = data.cdn
  }

  onSimBannerChange(data, idx) {
    this.settings.simThemeImages[idx].src = data.cdn
  }

  onChangeSimBannerUrl(e, idx) {
    const value = e.target.value.trim()
    this.settings.simThemeImages[idx].src = value
  }

  onChangeJumpUrl(e, idx) {
    const value = e.target.value.trim()
    this.settings.simThemeImages[idx].url = value
  }

  onDeleteSimBanner(idx: number) {
    this.settings.simThemeImages.splice(idx, 1)
  }

  onAddSimBanner() {
    this.settings.simThemeImages.push({
      ...this.settings.simThemeImages[0]
    })
  }

  onShortcutImgChange(data) {
    this.settings.shortcutThemeImages[0].src = data.cdn
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    const values = {
      ...this.validateForm.value,
      simThemeImages: this.settings.simThemeImages,
      shortcutThemeImages: this.settings.shortcutThemeImages
    }

    this.submitting = true
    updateFileContent({
      message: 'Update settings',
      content: JSON.stringify(values, null, 2),
      path: SETTING_PATH
    })
      .then(() => {
        this.message.success($t('_saveSuccess'))
      })
      .catch(res => {
        this.notification.error($t('_error'), res.message as string)
      })
      .finally(() => {
        this.submitting = false
      })
  }
}
