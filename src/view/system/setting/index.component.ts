// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
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
    private modal: NzModalService,
  ) {}

  ngOnInit () {
    this.validateForm = this.fb.group({
      ...settings
    })
  }

  onLogoChange(data: any) {
    this.settings.favicon = data.cdn || data.target?.value || ''
  }

// Sim ===========================
  onSimBannerChange(data: any, idx: number) {
    this.settings.simThemeImages[idx]['src'] = data.cdn
  }

  onChangeSimBannerUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.simThemeImages[idx]['src'] = value
  }

  onChangeSimJumpUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.simThemeImages[idx]['url'] = value
  }

  onDeleteSimBanner(idx: number) {
    this.settings.simThemeImages.splice(idx, 1)
  }

  onAddSimBanner() {
    this.settings.simThemeImages.push({
      ...this.settings.simThemeImages[0]
    })
  }

// Side ===========================
  onSideBannerChange(data: any, idx: number) {
    this.settings.sideThemeImages[idx]['src'] = data.cdn
  }

  onChangeSideBannerUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.sideThemeImages[idx]['src'] = value
  }

  onChangeSideJumpUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.sideThemeImages[idx]['src'] = value
  }

  onDeleteSideBanner(idx: number) {
    this.settings.sideThemeImages.splice(idx, 1)
  }

  onAddSideBanner() {
    this.settings.sideThemeImages.push({
      ...this.settings.sideThemeImages[0]
    })
  }

// Mirror ===========================
  onMirrorBannerChange(data: any, idx: number) {
    this.settings.sideThemeImages[idx]['src'] = data.cdn
  }

  onAddMirror() {
    this.settings.mirrorList.push({
      url: '',
      icon: '',
      name: ''
    })
  }

  onDelMirror(idx: number) {
    this.settings.mirrorList.splice(idx, 1)
  }

  onChangeMirrorUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.mirrorList[idx]['url'] = value
  }

  onChangeMirrorName(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.mirrorList[idx]['name'] = value
  }

  onShortcutImgChange(e: any) {
    const url = e?.target?.value?.trim() || e.cdn
    if (!url) {
      return
    }
    this.settings.shortcutThemeImages[0]['src'] = url
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        const values = {
          ...this.validateForm.value,
          favicon: this.settings.favicon,
          simThemeImages: this.settings.simThemeImages,
          shortcutThemeImages: this.settings.shortcutThemeImages,
          sideThemeImages: this.settings.sideThemeImages,
          mirrorList: this.settings.mirrorList.filter(item => (
            item['url'] && item['name']
          ))
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
    })
  }
}
