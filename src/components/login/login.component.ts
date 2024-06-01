// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { verifyToken, updateFileContent, createBranch } from '../../services'
import { setToken, removeToken, removeWebsite } from '../../utils/user'
import { $t } from 'src/locale'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input() visible: boolean = false
  @Output() onCancel = new EventEmitter()

  $t = $t
  token = ''
  submiting = false

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {}

  hanldeCancel() {
    this.onCancel.emit()
  }

  login() {
    if (!this.token) {
      return this.message.error($t('_pleaseInputToken'))
    }
    const token = this.token.trim()

    this.submiting = true
    verifyToken(token)
      .then(() => {
        setToken(token)
        updateFileContent({
          message: 'auth',
          path: '.navauth',
          content: 'OK',
        })
          .then(() => {
            createBranch('image').finally(() => {
              this.message.success($t('_tokenVerSuc'))
              removeWebsite()
              setTimeout(() => window.location.reload(), 2000)
            })
          })
          .catch((res) => {
            this.notification.error(
              `${$t('_error')}: ${res?.response?.status ?? 401}`,
              res.message
            )
            removeToken()
            this.submiting = false
          })
      })
      .catch((res) => {
        this.notification.error($t('_tokenVerFail'), res.message as string)
        this.submiting = false
      })
  }
}
