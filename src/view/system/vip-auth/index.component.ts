// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { setAuthCode, getAuthCode, removeAuthCode } from 'src/utils/user'
import { getUserCollect } from 'src/services'

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

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.getUserCollect()
  }

  getUserCollect() {
    this.submitting = true
    getUserCollect()
      .then((res: any) => {
        this.isPermission = !!res.data.success
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
    this.getUserCollect()
  }

  logoutAuthCode() {
    removeAuthCode()
    window.location.reload()
  }
}
