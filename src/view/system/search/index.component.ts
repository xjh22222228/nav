// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { ISearchEngineProps } from 'src/types'
import { updateFileContent } from 'src/services'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SEARCH_PATH } from 'src/constants'
import { searchEngineList } from 'src/store'

@Component({
  selector: 'system-tag',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class SystemSearchComponent {
  $t = $t
  searchList: ISearchEngineProps[] = searchEngineList
  submitting: boolean = false

  constructor (
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {}

  handleAdd() {
    this.searchList.unshift({
      name: '',
      url: '',
      icon: '',
      placeholder: '',
      blocked: false,
      isInner: false
    })
  }

  handleDelete(idx) {
    this.searchList.splice(idx, 1)
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        const o = {}
        this.searchList.forEach(item => {
          if (item.name.trim()) {
            o[item.name] = null
          }
        })

        if (Object.keys(o).length !== this.searchList.length) {
          this.message.error($t('_repeatAdd'))
          return
        }

        this.submitting = true
        updateFileContent({
          message: 'Update Search',
          content: JSON.stringify(this.searchList, null, 2),
          path: SEARCH_PATH
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .catch(res => {
            this.notification.error($t('_error'), res.message as string)
          })
          .finally(() => {
            this.submitting = false
          })
      }
    })
  }

  onChangeUpload(path, idx: number) {
    this.searchList[idx].icon = path.cdn
  }
}
