// @ts-nocheck
// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { downloadAsFile } from 'src/utils'
import { parseBookmark } from 'src/utils/bookmark'
import { INavProps } from 'src/types'
import { websiteList } from 'src/store'
import { bookmarksExport } from 'src/services'

@Component({
  selector: 'system-bookmark-export',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemBookmarkExportComponent {
  $t = $t
  submitting = false
  websiteList: INavProps[] = websiteList

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {}

  bookmarksExport() {
    if (this.submitting) {
      return
    }
    this.submitting = true
    bookmarksExport({ data: this.websiteList })
      .then((res) => {
        if (res.data?.success) {
          downloadAsFile(res.data.data, '发现导航导出.html')
          this.message.success('Successed!')
        }
      })
      .finally(() => {
        this.submitting = false
      })
  }
}
