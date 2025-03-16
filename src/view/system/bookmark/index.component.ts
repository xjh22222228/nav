// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { setWebsiteList } from 'src/utils/web'
import { parseBookmark } from 'src/utils/bookmark'
import type { INavProps } from 'src/types'
import { websiteList } from 'src/store'
import { NzInputModule } from 'ng-zorro-antd/input'

@Component({
  standalone: true,
  imports: [NzInputModule],
  selector: 'system-bookmark',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemBookmarkComponent {
  $t = $t
  websiteList: INavProps[] = websiteList

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {}

  onBookChange(e: any) {
    const that = this
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = function () {
      const html = this.result as string
      try {
        const result = parseBookmark(html)
        if (!Array.isArray(result)) {
          that.notification.error(
            $t('_errorBookTip'),
            `${result?.message ?? ''}`
          )
        } else {
          that.message.success($t('_importSuccess'))
          that.websiteList = result
          setWebsiteList(that.websiteList)
          setTimeout(() => window.location.reload(), 2000)
        }
      } catch (error: any) {
        that.notification.error($t('_errorBookTip'), `${error.message}`)
      }
    }
  }
}
