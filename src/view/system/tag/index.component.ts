// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { ITagPropValues } from 'src/types'
import { updateFileContent } from 'src/services'
import { TAG_PATH } from 'src/constants'
import { tagMap } from 'src/store'

@Component({
  selector: 'system-tag',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class SystemTagComponent {
  $t = $t
  tagList: ITagPropValues[] = []
  submitting: boolean = false

  constructor (
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {}

  ngOnInit () {
    const list: ITagPropValues[] = []
    for (const k in tagMap) {
      list.push({
        name: k,
        ...tagMap[k]
      })
    }
    this.tagList = list
  }

  onColorChange(e, idx: number) {
    const color = e.target.value
    this.tagList[idx].color = color
  }

  handleAdd() {
    this.tagList.unshift({
      name: '',
      createdAt: new Date().toISOString(),
      color: '#f50000',
      desc: '',
      isInner: false
    })
  }

  handleDelete(idx) {
    this.tagList.splice(idx, 1)
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
        this.tagList.forEach(item => {
          if (item.name.trim()) {
            o[item.name] = {
              ...item,
              name: undefined
            }
          }
        })

        if (Object.keys(o).length !== this.tagList.length) {
          this.message.error($t('_repeatAdd'))
          return
        }

        this.submitting = true
        updateFileContent({
          message: 'Update Tag',
          content: JSON.stringify(o, null, 2),
          path: TAG_PATH
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
}
