// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { verifyToken, updateFileContent, createBranch } from 'src/api'
import { setToken, removeToken, removeWebsite } from 'src/utils/user'
import { $t } from 'src/locale'
import { isSelfDevelop } from 'src/utils/util'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NzModalModule, NzInputModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input() visible: boolean = false
  @Output() onCancel = new EventEmitter()

  $t = $t
  isSelfDevelop = isSelfDevelop
  token = ''
  submiting = false

  constructor(private message: NzMessageService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.inputFocus()
  }

  hanldeCancel() {
    this.onCancel.emit()
  }

  inputFocus() {
    setTimeout(() => {
      document.getElementById('loginInput')?.focus?.()
    }, 300)
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.login()
    }
  }

  login(): any {
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
              removeWebsite().finally(() => {
                window.location.reload()
              })
            })
          })
          .catch(() => {
            removeToken()
            this.submiting = false
          })
      })
      .catch(() => {
        this.submiting = false
      })
  }
}
