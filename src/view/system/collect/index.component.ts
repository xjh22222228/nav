// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { websiteList, tagMap } from 'src/store'
import { setAuthCode, getAuthCode } from 'src/utils/user'
import { getUserCollect, delUserCollect, updateFileContent } from 'src/api'
import { DB_PATH } from 'src/constants'
import { isSelfDevelop } from 'src/utils/utils'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzTableModule } from 'ng-zorro-antd/table'
import { LogoComponent } from 'src/components/logo/logo.component'
import { TagListComponent } from 'src/components/tag-list/index.component'
import { ActionType } from 'src/types'
import { deleteWebByIds } from 'src/utils/web'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzButtonModule,
    NzTableModule,
    LogoComponent,
    TagListComponent,
  ],
  providers: [NzMessageService, NzModalService],
  selector: 'user-collect',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class CollectComponent {
  $t = $t
  isSelfDevelop = isSelfDevelop
  submitting: boolean = false
  isPermission = !!getAuthCode()
  dataList: Array<any> = []
  authCode = ''
  tagMap = tagMap
  typeMap: any = {
    [ActionType.Create]: $t('_add'),
    [ActionType.Edit]: $t('_edit'),
    [ActionType.Delete]: $t('_del'),
  }
  setOfCheckedId = new Set<number>()
  checked = false

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.getUserCollect()
  }

  onAllChecked(checked: boolean) {
    this.checked = checked
    this.dataList.forEach((item) => {
      if (checked) {
        this.setOfCheckedId.add(item.extra.uuid)
      } else {
        this.setOfCheckedId.delete(item.extra.uuid)
      }
    })
  }

  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id)
    } else {
      this.setOfCheckedId.delete(id)
    }
  }

  batchDelete() {
    if (this.submitting || !this.setOfCheckedId.size) {
      return
    }

    this.modal.info({
      nzTitle: $t('_confirmDel'),
      nzOnOk: () => {
        this.submitting = true
        delUserCollect({
          data: this.dataList.filter((item) =>
            this.setOfCheckedId.has(item.extra.uuid)
          ),
        })
          .then((res) => {
            this.checked = false
            this.setOfCheckedId.clear()
            this.dataList = res.data?.data || []
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  handleDelete(idx: number) {
    this.submitting = true
    delUserCollect({
      data: [this.dataList[idx]],
    })
      .then((res) => {
        this.dataList = res.data?.data || []
      })
      .finally(() => {
        this.submitting = false
      })
  }

  getUserCollect() {
    this.submitting = true
    getUserCollect()
      .then((res: any) => {
        this.isPermission = true
        this.dataList = res.data?.data || []
      })
      .finally(() => {
        this.submitting = false
      })
  }

  handleSubmitAuthCode() {
    if (this.submitting || !this.authCode) {
      return
    }

    setAuthCode(this.authCode)
    this.getUserCollect()
  }

  handleCreate(data: any, idx: number) {
    const that = this
    event.emit('CREATE_WEB', {
      parentId: data.parentId,
      detail: data,
      isMove: true,
    })
    event.emit('SET_CREATE_WEB', {
      detail: null,
      callback() {
        that.handleDelete(idx)
      },
    })
  }

  handleDeleteWeb(data: any, idx: number) {
    this.modal.info({
      nzTitle: $t('_confirmDel'),
      nzOnOk: async () => {
        if (await deleteWebByIds([data.id])) {
          this.message.success($t('_delSuccess'))
        }
        this.handleDelete(idx)
      },
    })
  }

  handleUpdateWeb(data: any) {
    event.emit('CREATE_WEB', {
      detail: data,
    })
  }

  handleClick(data: any, idx: number) {
    if (data.extra.type === ActionType.Create) {
      this.handleCreate(data, idx)
    } else if (data.extra.type === ActionType.Delete) {
      this.handleDeleteWeb(data, idx)
    } else if (data.extra.type === ActionType.Edit) {
      this.handleUpdateWeb(data)
    }
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
        this.submitting = true
        updateFileContent({
          message: 'update db',
          content: JSON.stringify(websiteList),
          path: DB_PATH,
        })
          .then(() => {
            this.message.success($t('_syncSuccessTip'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  trackByItem(i: number, item: any) {
    return item.id
  }
}
