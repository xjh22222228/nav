// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { setAuthCode, getAuthCode, removeAuthCode } from 'src/utils/user'
import { getUserInfo, updateUserInfo } from 'src/api'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd/spin'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
  ],
  selector: 'auth',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class AuthComponent {
  $t = $t
  submitting: boolean = false
  isPermission = !!getAuthCode()
  authCode = ''
  url = ''

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.getUserInfo()
  }

  async getUserInfo(params?: any) {
    this.submitting = true
    return getUserInfo(params)
      .then((res: any) => {
        if (typeof res.data?.data?.url === 'string') {
          this.isPermission = true
          this.url = res.data.data.url
        }
        return res
      })
      .finally(() => {
        this.submitting = false
      })
  }

  handleSubmitAuthCode() {
    if (this.submitting || !this.authCode) {
      return
    }

    this.getUserInfo({ code: this.authCode }).then(() => {
      setAuthCode(this.authCode)
      window.location.reload()
    })
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
