// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzButtonModule } from 'ng-zorro-antd/button'
import type { INavProps, IWebProps } from 'src/types'
import { navs } from 'src/store'
import { bookmarksExport } from 'src/api'
import { saveAs } from 'file-saver'
import { getAuthCode } from 'src/utils/user'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { dfsNavs } from 'src/utils/pureUtils'
import LZString from 'lz-string'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzSwitchModule,
    NzSpinModule,
    FormsModule,
    NzButtonModule,
  ],
  selector: 'system-bookmark-export',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemBookmarkExportComponent {
  readonly $t = $t
  submitting = false

  constructor(private notification: NzNotificationService) {}

  async bookmarksExport(): Promise<any> {
    if (!getAuthCode()) {
      return this.notification.error('Error', 'Bad credentials')
    }

    if (this.submitting) {
      return
    }
    const navsData = dfsNavs({
      navs: navs(),
      callback: (data: INavProps) => {
        for (const k in data) {
          const keys = ['title', 'nav', 'icon']
          if (!keys.includes(k)) {
            delete data[k]
          }
        }
      },
      webCallback: (data: IWebProps) => {
        for (const k in data) {
          const keys = ['url', 'icon', 'name']
          if (!keys.includes(k)) {
            delete data[k]
          }
        }
      },
    })

    this.submitting = true
    bookmarksExport({ data: LZString.compress(JSON.stringify(navsData)) })
      .then((res) => {
        const fileName = 'bookmarks.html'
        const blob = new Blob([res.data.data], {
          type: 'text/html;charset=utf-8',
        })
        saveAs(blob, fileName)
        this.notification.success('OK', fileName, {
          nzDuration: 0,
        })
      })
      .finally(() => {
        this.submitting = false
      })
  }
}
