// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { setWebsiteList } from 'src/utils'
import { parseBookmark } from 'src/utils/bookmark'
import { INavProps } from 'src/types'
import { websiteList } from 'src/store'

@Component({
  selector: 'system-bookmark',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class SystemBookmarkComponent {
  $t = $t
  websiteList: INavProps[] = websiteList

  constructor (
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit () {
  }

  onBookChange(e) {
    const that = this
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = function() {
      const html = this.result as string
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
    }
  }
}
