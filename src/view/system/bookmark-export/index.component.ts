// @ts-nocheck
// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { parseBookmark } from 'src/utils/bookmark'
import { INavProps, IWebProps } from 'src/types'
import { websiteList } from 'src/store'
import { bookmarksExport } from 'src/api'
import { saveAs } from 'file-saver'
import { getAuthCode } from 'src/utils/user'

@Component({
  selector: 'system-bookmark-export',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemBookmarkExportComponent {
  $t = $t
  submitting = false
  websiteList: INavProps[] = websiteList
  isExportIcon = false
  seconds = 0
  currentNumber = 0
  countAll = 0

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {}

  loadImage(url: string) {
    return new Promise((resolve) => {
      if (!url) {
        return resolve(null)
      }
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        resolve(img)
      }
      img.onerror = function () {
        resolve(null)
      }
      img.src = url
    })
  }

  async imageToBase64(item: IWebProps) {
    if (item.icon?.startsWith('data:image')) {
      return
    }

    const img = await this.loadImage(item.icon)
    if (img) {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        item.icon = dataURL
        return dataURL
      } catch (error) {}
    }
  }

  async bookmarksExport() {
    if (!getAuthCode()) {
      return this.notification.error('Error', '请授权')
    }

    if (this.submitting) {
      return
    }
    const that = this
    this.seconds = 0
    this.countAll = 0
    this.submitting = true
    const interval = setInterval(() => {
      this.seconds += 1
    }, 1000)

    const webs: INavProps = JSON.parse(JSON.stringify(this.websiteList))
    const promiseItems = []
    function getIconItems(data) {
      if (!Array.isArray(data)) {
        return
      }
      data.forEach((item) => {
        if (Array.isArray(item.nav)) {
          getIconItems(item.nav)
        }
        if (item.url) {
          promiseItems.push(
            that.imageToBase64(item).finally(() => {
              that.currentNumber += 1
            })
          )
        }
      })
    }
    if (this.isExportIcon) {
      getIconItems(webs)
      this.countAll = promiseItems.length
      await Promise.allSettled(promiseItems)
    }

    bookmarksExport({ data: webs })
      .then((res) => {
        const fileName = '发现导航书签.html'
        const blob = new Blob([res.data.data], {
          type: 'text/html;charset=utf-8',
        })
        saveAs(blob, fileName)
        this.notification.success('导出成功', fileName, {
          nzDuration: 0,
        })
      })
      .finally(() => {
        this.submitting = false
        clearInterval(interval)
      })
  }
}
