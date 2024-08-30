// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ISearchEngineProps } from 'src/types'
import { updateFileContent } from 'src/api'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SEARCH_PATH } from 'src/constants'
import { searchEngineList } from 'src/store'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'system-tag',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemSearchComponent {
  $t = $t
  searchList: ISearchEngineProps[] = searchEngineList
  submitting: boolean = false

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  handleAdd() {
    const isEmpty = this.searchList.some((item) => !item.name.trim())
    if (isEmpty) {
      return
    }
    this.searchList.unshift({
      name: '',
      url: '',
      icon: '',
      placeholder: '',
      blocked: false,
      isInner: false,
    })
  }

  handleDelete(idx: number) {
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
        this.searchList.forEach((item) => {
          if (item.name.trim()) {
            // @ts-ignore
            o[item.name] = null
          }
        })

        if (Object.keys(o).length !== this.searchList.length) {
          this.message.error($t('_repeatAdd'))
          return
        }

        this.submitting = true
        updateFileContent({
          message: 'update search',
          content: JSON.stringify(this.searchList),
          path: SEARCH_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  trackByItem(a: any, item: any) {
    return item.name
  }

  onChangeUpload(path: any, idx: number) {
    this.searchList[idx].icon = path.cdn
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.searchList, event.previousIndex, event.currentIndex)
  }
}
