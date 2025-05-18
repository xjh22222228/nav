// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { createFile } from 'src/api'
import { NzIconModule } from 'ng-zorro-antd/icon'

@Component({
  standalone: true,
  imports: [CommonModule, NzIconModule],
  selector: 'app-upload-file',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class UploadFileComponent {
  @Output() onChange = new EventEmitter()

  readonly $t = $t
  uploading: boolean = false
  // @ts-ignore
  id = `f${Date.now()}${parseInt(Math.random() * 1000000)}`

  constructor(private message: NzMessageService) {}

  onChangeFile(e: any): any {
    if (this.uploading) {
      return
    }

    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]

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
        const path = file.name

        createFile({
          message: `create ${path}`,
          content: url,
          path,
        })
          .then((res) => {
            const params = {
              cdn: res?.data.filePath,
            }
            window.open(params.cdn)
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
