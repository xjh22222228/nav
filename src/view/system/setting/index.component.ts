// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SETTING_PATH } from 'src/constants'
import { updateFileContent } from 'src/services'
import { settings } from 'src/store'

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

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.validateForm = this.fb.group({
      ...settings,
    })
  }

  ngOnInit() {}

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
          message: 'Update settings',
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
