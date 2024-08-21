// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { setAuthCode, getAuthCode, removeAuthCode } from 'src/utils/user'
import { getUserInfo, updateUserInfo } from 'src/api'

@Component({
  selector: 'user-collect',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class VipAuthComponent {
  $t = $t
  submitting: boolean = false
  isPermission = !!getAuthCode()
  authCode = ''
  url = ''

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.getUserInfo()
  }

  getUserInfo() {
    this.submitting = true
    getUserInfo()
      .then((res: any) => {
        this.isPermission = true
        this.url = res.data?.data?.url || ''
      })
      .finally(() => {
        this.submitting = false
      })
  }

  handleSubmitAuthCode() {
    if (this.submitting || !this.authCode) {
      return
    }

    setAuthCode(this.authCode)
    this.getUserInfo()
  }

  handleSave() {
    this.submitting = true
    updateUserInfo({
      url: this.url,
    })
      .then(() => {
        this.getUserInfo()
        this.message.success(this.$t('_saveSuccess'))
      })
      .finally(() => {
        this.submitting = false
      })
  }

  logoutAuthCode() {
    removeAuthCode()
    window.location.reload()
  }
}
