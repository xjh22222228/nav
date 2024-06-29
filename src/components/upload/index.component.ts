// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { createFile, getCDN } from 'src/services'

@Component({
  selector: 'app-upload',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class UploadComponent {
  @Output() onChange = new EventEmitter()

  $t = $t
  uploading: boolean = false
  id = `f${Date.now()}`

  constructor(private message: NzMessageService) {}

  onChangeFile(e: any) {
    if (this.uploading) {
      return
    }

    const { files } = e.target
    if (files.length <= 0) return
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
      fileReader.onload = function () {
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
          path,
        })
          .then(() => {
            const params = {
              rawPath: path,
              cdn: getCDN(path),
            }
            that.onChange.emit(params)
            that.message.success($t('_uploadSuccess'))
            resolve(params)
          })
          .catch(reject)
          .finally(() => {
            that.uploading = false
          })
      }
    })
  }
}
