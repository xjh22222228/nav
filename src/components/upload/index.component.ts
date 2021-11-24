// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { createFile, getCDN } from 'src/services'

@Component({
  selector: 'app-upload',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class UploadComponent {
  @Output() onChange = new EventEmitter()

  $t = $t
  uploading: boolean = false
  id = `f${Date.now()}`

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) {}

  onChangeFile(e) {
    if (this.uploading) {
      return
    }

    const { files } = e.target
    if (files.length <= 0) return;
    const file = files[0]

    if (!file.type.startsWith('image')) {
      return this.message.error($t('_notUpload'))
    }
    this.onUpload(file).finally(() => {
      e.target.value = ''
    })
  }

  onUpload(file: File) {
    const that = this
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onerror = reject
      fileReader.onload = function() {
        that.uploading = true
        const iconUrl = this.result as string
        const url = iconUrl.split(',')[1]
        // file.name 方便自动带上文件后缀
        const path = `nav-${Date.now()}-${file.name}`

        createFile({
          branch: 'image',
          message: 'create image',
          content: url,
          isEncode: false,
          path
        }).then(() => {
          resolve(null)
          that.onChange.emit({
            rawPath: path,
            cdn: getCDN(path)
          })
          that.message.success($t('_uploadSuccess'))
        }).catch(res => {
          that.notification.error(
            `${$t('_error')}: ${res?.response?.status ?? 401}`,
            $t('_uploadFail')
          )
          reject(res)
        }).finally(() => {
          that.uploading = false
        })
      }
    })
  }
}
