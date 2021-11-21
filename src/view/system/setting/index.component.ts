// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { LOGO_PATH, LOGO_CDN, SETTING_PATH } from 'src/constants'
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
  LOGO_CDN: string = LOGO_CDN
  uploading: boolean = false
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

  onLogoChange(e) {
    const that = this
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]

    if (file.type !== 'image/png') {
      return this.message.error($t('_acceptPng'))
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function() {
      that.uploading = true
      const url = (this.result as string).split(',')[1]
      const logoEL = document.querySelector('.logo') as HTMLImageElement
      const tempSrc = logoEL.src
      logoEL.src = this.result as string

      updateFileContent({
        message: 'update logo',
        content: url,
        isEncode: false,
        path: LOGO_PATH,
        branch: 'image'
      }).then(() => {
        that.message.success($t('_updateLogoSuccess'))
      }).catch(res => {
        logoEL.src = tempSrc
        that.notification.error(
          `${$t('_error')}: ${res?.response?.status ?? 401}`,
          `${res?.response?.data?.message ?? $t('_updateLogoFail')}`
        )
      }).finally(() => {
        e.target.value = ''
        that.uploading = false
      })
    }
  }

  onSimBannerChange(data, idx) {
    this.settings.simThemeImages[idx].src = data.cdn
  }

  onShortcutImgChange(data) {
    this.settings.shortcutThemeImage = data.cdn
  }

  onChangeBannerUrl(e, idx) {
    const value = e.target.value.trim()
    this.settings.simThemeImages[idx].src = value
  }

  onChangeJumpUrl(e, idx) {
    const value = e.target.value.trim()
    this.settings.simThemeImages[idx].url = value
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    const values = {
      ...this.validateForm.value,
      simThemeImages: this.settings.simThemeImages
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
