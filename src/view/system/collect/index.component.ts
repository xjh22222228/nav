// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { websiteList, tagMap } from 'src/store'
import { setAuthCode, getAuthCode } from 'src/utils/user'
import { getUserCollect, delUserCollect, updateFileContent } from 'src/api'
import { DB_PATH } from 'src/constants'
import { isSelfDevelop } from 'src/utils/util'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { LogoComponent } from 'src/components/logo/logo.component'
import { TagListComponent } from 'src/components/tag-list/index.component'
import { ActionType } from 'src/types'
import { deleteWebById } from 'src/utils/web'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzButtonModule,
    NzTableModule,
    NzPopconfirmModule,
    LogoComponent,
    TagListComponent,
  ],
  providers: [NzMessageService, NzModalService, NzNotificationService],
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

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.getUserCollect()
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
    let oneIndex = 0
    let twoIndex = 0
    let threeIndex = 0
    try {
      oneIndex = websiteList.findIndex(
        (item) => item.title === data.breadcrumb[0]
      )
      twoIndex = websiteList[oneIndex].nav.findIndex(
        (item) => item.title === data.breadcrumb[1]
      )
      threeIndex = websiteList[oneIndex].nav[twoIndex].nav.findIndex(
        (item) => item.title === data.breadcrumb[2]
      )
    } catch (error: any) {
      this.notification.error(
        $t('_error'),
        `${$t('_classNoMatch')}：${error.message}`
      )
    }

    try {
      event.emit('CREATE_WEB', {
        detail: data,
        oneIndex,
        twoIndex,
        threeIndex,
        isMove: true,
      })
      event.emit('SET_CREATE_WEB', {
        detail: null,
        callback() {
          that.handleDelete(idx)
        },
      })
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  handleDeleteWeb(data: any, idx: number) {
    this.modal.info({
      nzTitle: $t('_confirmDel'),
      nzOnOk: () => {
        if (deleteWebById(data.id)) {
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
