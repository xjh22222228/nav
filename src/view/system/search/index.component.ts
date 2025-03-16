// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import type { ISearchProps } from 'src/types'
import { updateFileContent } from 'src/api'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SEARCH_PATH } from 'src/constants'
import { searchEngineList } from 'src/store'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { UploadComponent } from 'src/components/upload/index.component'
import { isSelfDevelop } from 'src/utils/utils'

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    UploadComponent,
    NzSwitchModule,
    NzPopconfirmModule,
  ],
  providers: [NzModalService, NzMessageService],
  selector: 'system-tag',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemSearchComponent {
  readonly $t = $t
  readonly isSelfDevelop = isSelfDevelop
  searchList: ISearchProps[] = searchEngineList
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

  // 上移
  moveUp(index: number): void {
    if (index === 0) {
      return
    }
    const current = this.searchList[index]
    const prev = this.searchList[index - 1]
    this.searchList[index - 1] = current
    this.searchList[index] = prev
  }

  // 下移
  moveDown(index: number): void {
    if (index === this.searchList.length - 1) {
      return
    }
    const current = this.searchList[index]
    const next = this.searchList[index + 1]
    this.searchList[index + 1] = current
    this.searchList[index] = next
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
}
