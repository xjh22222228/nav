// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { websiteList, tagMap } from 'src/store'
import { setAuthCode, getAuthCode } from 'src/utils/user'
import { getUserCollect, delUserCollect, updateFileContent } from 'src/api'
import { DB_PATH } from 'src/constants'
import event from 'src/utils/mitt'

@Component({
  selector: 'user-collect',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class CollectComponent {
  $t = $t
  objectKeys = Object.keys
  submitting: boolean = false
  isPermission = !!getAuthCode()
  dataList: Array<any> = []
  authCode = ''
  tagMap = tagMap

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
      data: this.dataList[idx],
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

  handleConfirmGet(data: any, idx: number) {
    const that = this
    try {
      const oneIndex = websiteList.findIndex(
        (item) => item.title === data.extra.oneName
      )
      const twoIndex = websiteList[oneIndex].nav.findIndex(
        (item) => item.title === data.extra.twoName
      )
      const threeIndex = websiteList[oneIndex].nav[twoIndex].nav.findIndex(
        (item) => item.title === data.extra.threeName
      )
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
      this.notification.error(
        `${$t('_error')}`,
        `收录失败，可能分类位置名称发生改变，请手动删除：${error.message}`
      )
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
