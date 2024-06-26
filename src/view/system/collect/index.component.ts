// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { websiteList, settings, tagMap } from 'src/store'
import { setAuthCode, getAuthCode } from 'src/utils/user'
import { getUserCollect, delUserCollect, updateFileContent } from 'src/services'
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
    delUserCollect({
      data: this.dataList[idx],
    }).then((res) => {
      if (res.data.success) {
        this.dataList = res.data.data
      } else {
        this.message.error(res.data.message || '网络出错')
      }
    })
  }

  getUserCollect() {
    getUserCollect()
      .then((res: any) => {
        this.isPermission = !!res.data.success
        if (res.data.success === false) {
          this.message.error(res.data.message)
        }
        if (res.data.success && res.data.data) {
          this.dataList = res.data.data
        }
      })
      .catch((e: any) => {
        this.message.error(e.message || '网络出错')
      })
      .finally(() => {
        this.submitting = false
      })
  }

  handleSubmitAuthCode() {
    if (this.submitting || !this.authCode) {
      return
    }

    this.submitting = true
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
          .catch((res: any) => {
            this.notification.error(
              `${$t('_error')}: ${res?.response?.status ?? 1401}`,
              $t('_syncFailTip')
            )
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }
}
