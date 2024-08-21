// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SETTING_PATH } from 'src/constants'
import { updateFileContent, spiderWeb } from 'src/api'
import { settings } from 'src/store'
import { isSelfDevelop } from 'src/utils/util'
import event from 'src/utils/mitt'

@Component({
  selector: 'system-setting',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemSettingComponent {
  $t = $t
  validateForm!: FormGroup
  submitting: boolean = false
  settings = settings
  tabActive = 0
  isSelfDevelop = isSelfDevelop

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.validateForm = this.fb.group({
      ...settings,
    })

    event.on('GITHUB_USER_INFO', (data: any) => {
      this.validateForm
        .get('email')!
        .setValue(this.settings.email || data.email || '')
    })
  }

  onLogoChange(data: any) {
    this.settings.favicon = data.cdn || ''
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
      src: '',
      url: '',
    })
  }

  // Super ===========================
  onSuperBannerChange(data: any, idx: number) {
    this.settings.superImages[idx]['src'] = data.cdn
  }

  onChangeSuperBannerUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.superImages[idx]['src'] = value
  }

  onChangeSuperJumpUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.superImages[idx]['url'] = value
  }

  onDeleteSuperBanner(idx: number) {
    this.settings.superImages.splice(idx, 1)
  }

  onAddSuperBanner() {
    this.settings.superImages.push({
      src: '',
      url: '',
    })
  }

  // Light ===========================
  onLightBannerChange(data: any, idx: number) {
    this.settings.lightImages[idx]['src'] = data.cdn
  }

  onChangeLightBannerUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.lightImages[idx]['src'] = value
  }

  onChangeLightJumpUrl(e: any, idx: number) {
    const value = e.target.value.trim()
    this.settings.lightImages[idx]['url'] = value
  }

  onDeleteLightBanner(idx: number) {
    this.settings.lightImages.splice(idx, 1)
  }

  onAddLightBanner() {
    this.settings.lightImages.push({
      src: '',
      url: '',
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
      src: '',
      url: '',
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
      name: '',
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
    let url = e?.target?.value?.trim() || e.cdn
    if (!url) {
      url = ''
    }
    this.settings.shortcutThemeImages[0]['src'] = url
  }

  handleSpider() {
    if (this.submitting) {
      return
    }
    this.submitting = true
    spiderWeb()
      .then((res) => {
        this.notification.success(
          `爬取完成（${res.data.time}秒）`,
          '爬取完成并保存成功',
          {
            nzDuration: 0,
          }
        )
      })
      .finally(() => {
        this.submitting = false
      })
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
        function filterImage(item: Record<string, any>) {
          return item['src']
        }
        const values = {
          ...this.validateForm.value,
          favicon: this.settings.favicon,
          simThemeImages: this.settings.simThemeImages.filter(filterImage),
          shortcutThemeImages:
            this.settings.shortcutThemeImages.filter(filterImage),
          sideThemeImages: this.settings.sideThemeImages.filter(filterImage),
          superImages: this.settings.superImages.filter(filterImage),
          lightImages: this.settings.lightImages.filter(filterImage),
          mirrorList: this.settings.mirrorList.filter(
            (item) => item['url'] && item['name']
          ),
        }

        this.submitting = true
        updateFileContent({
          message: 'update settings',
          content: JSON.stringify(values),
          path: SETTING_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }
}
