// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzButtonModule } from 'ng-zorro-antd/button'
import type { INavProps } from 'src/types'
import { websiteList } from 'src/store'
import { bookmarksExport } from 'src/api'
import { saveAs } from 'file-saver'
import { getAuthCode } from 'src/utils/user'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzSpinModule } from 'ng-zorro-antd/spin'
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
  readonly websiteList: INavProps[] = websiteList
  submitting = false

  constructor(private notification: NzNotificationService) {}

  async bookmarksExport(): Promise<any> {
    if (!getAuthCode()) {
      return this.notification.error('Error', 'Bad credentials')
    }

    if (this.submitting) {
      return
    }
    const webs: INavProps = JSON.parse(JSON.stringify(this.websiteList))
    function removeAttrs(data: any) {
      if (!Array.isArray(data)) {
        return
      }
      data.forEach((item) => {
        if (item.title) {
          for (const k in item) {
            const keys = ['title', 'nav']
            if (!keys.includes(k)) {
              delete item[k]
            }
          }
        }
        if (item.url) {
          for (const k in item) {
            const keys = ['url', 'icon', 'name']
            if (!keys.includes(k)) {
              delete item[k]
            }
          }
        }
        if (Array.isArray(item.nav)) {
          removeAttrs(item.nav)
        }
      })
    }
    removeAttrs(webs)

    this.submitting = true
    bookmarksExport({ data: LZString.compress(JSON.stringify(webs)) })
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
