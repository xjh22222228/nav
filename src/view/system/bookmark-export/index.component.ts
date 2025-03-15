// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import type { INavProps, IWebProps } from 'src/types'
import { websiteList } from 'src/store'
import { bookmarksExport, getIconBase64 } from 'src/api'
import { saveAs } from 'file-saver'
import { getAuthCode } from 'src/utils/user'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import LZString from 'lz-string'

@Component({
  standalone: true,
  imports: [CommonModule, NzSwitchModule, NzSpinModule, FormsModule],
  selector: 'system-bookmark-export',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemBookmarkExportComponent {
  readonly $t = $t
  submitting = false
  websiteList: INavProps[] = websiteList
  isExportIcon = false
  seconds = 0
  currentNumber = 0
  countAll = 0

  constructor(private notification: NzNotificationService) {}

  ngOnInit() {}

  private loadImage(iconUrl: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      if (!iconUrl) {
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
      img.src = iconUrl
    })
  }

  private async imageToBase64(
    item: IWebProps,
    isGet: boolean = true
  ): Promise<any> {
    const iconUrl = await this.loadImage(item.icon)
    if (iconUrl) {
      try {
        const size = 32
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.drawImage(iconUrl, 0, 0, size, size)
        const dataURL = canvas.toDataURL()
        item.icon = dataURL
        return dataURL
      } catch {}
    } else {
      if (!isGet) {
        return
      }
      try {
        if (!item.icon) {
          return
        }
        const res = await getIconBase64({ url: item.icon })
        if (res.data.base64) {
          item.icon = res.data.base64
          await this.imageToBase64(item, false)
        }
      } catch (e: any) {
        const pre = document.getElementById('error-msg')
        if (pre) {
          const html = `
          <a href="${item.icon}" target="_blank">${item.name} ${item.icon}</a>
          <div>${e.response?.data?.message || e.message}</div>
        `
          pre.innerHTML = html + pre.innerHTML
        }
      }
    }
  }

  async bookmarksExport(): Promise<any> {
    if (!getAuthCode()) {
      return this.notification.error('Error', 'Bad credentials')
    }

    if (this.submitting) {
      return
    }
    const that = this
    this.seconds = 0
    this.countAll = 0
    this.currentNumber = 0
    this.submitting = true
    const interval = setInterval(() => {
      this.seconds += 1
    }, 1000)

    const webs: INavProps = JSON.parse(JSON.stringify(this.websiteList))
    const promiseItems: Promise<any>[] = []
    function getIconItems(data: any) {
      if (!Array.isArray(data)) {
        return
      }
      data.forEach((item) => {
        // 移除无用属性，减少传输大小
        ;[
          'id',
          'rate',
          'top',
          'topTypes',
          'index',
          'ownVisible',
          'breadcrumb',
          'ok',
          '__name__',
          '__desc__',
          'collapsed',
          'tags',
        ].forEach((key) => {
          delete item[key]
        })
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
        clearInterval(interval)
      })
  }
}
