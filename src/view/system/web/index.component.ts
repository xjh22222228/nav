// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import type {
  INavProps,
  INavTwoProp,
  INavThreeProp,
  IWebProps,
} from 'src/types'
import {
  websiteList,
  settings,
  searchEngineList,
  tagList,
  internal,
  component,
} from 'src/store'
import { isLogin, removeWebsite } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { setWebsiteList } from 'src/utils/web'
import { updateFileContent } from 'src/api'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import { $t } from 'src/locale'
import { saveAs } from 'file-saver'
import { isSelfDevelop } from 'src/utils/utils'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { LogoComponent } from 'src/components/logo/logo.component'
import { TagListComponent } from 'src/components/tag-list/index.component'
import { CommonService } from 'src/services/common'
import event from 'src/utils/mitt'
import config from '../../../../nav.config.json'
import { cleanWebAttrs } from 'src/utils/pureUtils'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzToolTipModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzTableModule,
    NzTabsModule,
    NzPopconfirmModule,
    NzSelectModule,
    LogoComponent,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzSwitchModule,
    TagListComponent,
  ],
  selector: 'app-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class WebpComponent {
  readonly $t = $t
  readonly isSelfDevelop = isSelfDevelop
  readonly internal = internal
  readonly settings = settings
  readonly gitRepoUrl = config.gitRepoUrl
  readonly isLogin = isLogin
  websiteList: INavProps[] = websiteList
  showCreateModal = false
  syncLoading = false
  uploading = false
  tabActive = 0
  oneSelect = -1
  twoSelect = -1
  threeSelect = -1
  checkedAll = false
  setOfCheckedId = new Set<number>()
  errorWebs: IWebProps[] = []

  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    public commonService: CommonService
  ) {}

  ngOnInit() {}

  get oneIndex() {
    return this.websiteList.findIndex((item) => item.id === this.oneSelect)
  }

  get twoIndex() {
    try {
      return this.twoTableData.findIndex((item) => item.id === this.twoSelect)
    } catch {
      return -1
    }
  }

  get threeIndex() {
    try {
      return this.threeTableData.findIndex(
        (item) => item.id === this.threeSelect
      )
    } catch {
      return -1
    }
  }

  get twoTableData(): INavTwoProp[] {
    try {
      return (
        this.websiteList.find((item) => item.id === this.oneSelect)?.nav || []
      )
    } catch {
      return []
    }
  }

  get threeTableData(): INavThreeProp[] {
    try {
      return (
        this.twoTableData.find((item) => item.id === this.twoSelect)?.nav || []
      )
    } catch {
      return []
    }
  }

  get websiteTableData(): IWebProps[] {
    try {
      const data = this.threeTableData.find(
        (item) => item.id === this.threeSelect
      )
      if (data) {
        return data.nav
      }
      return this.errorWebs
    } catch {
      return this.errorWebs
    }
  }

  getErrorWebs() {
    this.oneSelect = -1
    this.twoSelect = -1
    this.threeSelect = -1
    this.onTabChange()
    const errorWebs: IWebProps[] = []
    function r(nav: any) {
      if (!Array.isArray(nav)) return

      for (let i = 0; i < nav.length; i++) {
        const item = nav[i]
        if (item.url && item.ok === false) {
          errorWebs.push(item)
        } else {
          r(item.nav)
        }
      }
    }
    r(this.websiteList)
    this.errorWebs = errorWebs
    if (errorWebs.length <= 0) {
      this.message.success('No error!')
    } else {
      this.message.warning(`检测出 ${errorWebs.length} 个网站疑似异常`)
    }
  }

  onCheckAll(checked: boolean) {
    this.setOfCheckedId.clear()
    this.checkedAll = checked
    const data = [
      this.websiteList,
      this.twoTableData,
      this.threeTableData,
      this.websiteTableData,
    ]
    data[this.tabActive].forEach((item) => {
      if (checked) {
        this.setOfCheckedId.add(item.id)
      } else {
        this.setOfCheckedId.delete(item.id)
      }
    })
  }

  onItemChecked(id: number, checked: boolean) {
    if (checked) {
      this.setOfCheckedId.add(id)
    } else {
      this.setOfCheckedId.delete(id)
    }
  }

  async onBatchDelete() {
    switch (this.tabActive) {
      case 0:
      case 1:
      case 2:
        event.emit('DELETE_MODAL', {
          ids: [...this.setOfCheckedId],
          isClass: true,
          onComplete: () => {
            this.onTabChange()
          },
        })
        break

      case 3:
        event.emit('DELETE_MODAL', {
          ids: [...this.setOfCheckedId],
          ok: () => {
            if (this.errorWebs.length) {
              this.getErrorWebs()
            }
          },
          onComplete: () => {
            this.onTabChange()
          },
        })
        break
    }
  }

  handleReset() {
    this.modal.info({
      nzTitle: $t('_resetInitData'),
      nzContent: $t('_warnReset'),
      nzOnOk: () => {
        this.message.success($t('_actionSuccess'))
        window.localStorage.removeItem(STORAGE_KEY_MAP.DATE_TIME)
        removeWebsite().finally(() => {
          window.location.reload()
        })
      },
    })
  }

  handleDownloadBackup() {
    const params: any = {
      db: this.websiteList,
      settings,
      tag: tagList,
      search: searchEngineList,
      component,
    }
    for (const k in params) {
      saveAs(
        new Blob([JSON.stringify(params[k])], {
          type: 'text/plain;charset=utf-8',
        }),
        `${k}.json`
      )
    }
  }

  handleUploadBackup(e: any) {
    const that = this
    const files = e.target.files
    if (files.length <= 0) {
      return
    }
    const file = files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = function (data) {
      try {
        const { result } = data.target as any
        that.websiteList = JSON.parse(result)
        that.message.success($t('_actionSuccess'))
        setWebsiteList(that.websiteList).finally(() => {
          location.reload()
        })
      } catch (error: any) {
        that.notification.error($t('_error'), error.message)
      }
    }
  }

  goBack() {
    history.go(-1)
  }

  openMoveWebModal(data: any, level?: number) {
    event.emit('MOVE_WEB', {
      id: data.id,
      data: [data],
      level,
    })
  }

  openCreateWebModal(): any {
    if (this.tabActive === 3 && this.threeSelect === -1) {
      return this.message.error($t('_sel3'))
    }
    event.emit('CREATE_WEB', {
      parentId: this.threeSelect,
    })
  }

  openEditWebModal(detail: IWebProps) {
    event.emit('CREATE_WEB', {
      detail,
    })
  }

  onTabChange(index?: number) {
    this.errorWebs = []
    this.tabActive = index ?? this.tabActive
    this.setOfCheckedId.clear()
    this.checkedAll = false
  }

  // 上移一级
  moveOneUp(index: number): void {
    if (index === 0) {
      return
    }
    const current = this.websiteList[index]
    const prev = this.websiteList[index - 1]
    this.websiteList[index - 1] = current
    this.websiteList[index] = prev
    setWebsiteList(this.websiteList)
  }

  // 下移一级
  moveOneDown(index: number): void {
    if (index === this.websiteList.length - 1) {
      return
    }
    const current = this.websiteList[index]
    const next = this.websiteList[index + 1]
    this.websiteList[index + 1] = current
    this.websiteList[index] = next
    setWebsiteList(this.websiteList)
  }

  // 上移二级
  moveTwoUp(index: number): void {
    try {
      if (index === 0) {
        return
      }
      const current = this.websiteList[this.oneIndex].nav[index]
      const prev = this.websiteList[this.oneIndex].nav[index - 1]
      this.websiteList[this.oneIndex].nav[index - 1] = current
      this.websiteList[this.oneIndex].nav[index] = prev
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  // 下移二级
  moveTwoDown(index: number): void {
    try {
      if (index === this.websiteList[this.oneIndex].nav.length - 1) {
        return
      }
      const current = this.websiteList[this.oneIndex].nav[index]
      const next = this.websiteList[this.oneIndex].nav[index + 1]
      this.websiteList[this.oneIndex].nav[index + 1] = current
      this.websiteList[this.oneIndex].nav[index] = next
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  // 上移三级
  moveThreeUp(index: number): void {
    try {
      if (index === 0) {
        return
      }
      const current =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index]
      const prev =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index - 1]
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index - 1] =
        current
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index] = prev
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  // 下移三级
  moveThreeDown(index: number): void {
    try {
      if (
        index ===
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav.length - 1
      ) {
        return
      }
      const current =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index]
      const next =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index + 1]
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index + 1] =
        current
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[index] = next
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  // 上移网站
  moveWebUp(index: number): void {
    try {
      if (index === 0) {
        return
      }
      const current =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[this.threeIndex]
          .nav[index]
      const prev =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[this.threeIndex]
          .nav[index - 1]
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[
        this.threeIndex
      ].nav[index - 1] = current
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[
        this.threeIndex
      ].nav[index] = prev
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  // 下移网站
  moveWebDown(index: number): void {
    try {
      if (
        index ===
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[this.threeIndex]
          .nav.length -
          1
      ) {
        return
      }
      const current =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[this.threeIndex]
          .nav[index]
      const next =
        this.websiteList[this.oneIndex].nav[this.twoIndex].nav[this.threeIndex]
          .nav[index + 1]
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[
        this.threeIndex
      ].nav[index + 1] = current
      this.websiteList[this.oneIndex].nav[this.twoIndex].nav[
        this.threeIndex
      ].nav[index] = next
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  hanldeOneSelect(id: number) {
    this.oneSelect = id
    this.twoSelect = -1
    this.threeSelect = -1
    this.onTabChange()
  }

  hanldeTwoSelect(id: number) {
    this.twoSelect = id
    this.threeSelect = -1
    this.onTabChange()
  }

  hanldeThreeSelect(id: number) {
    this.threeSelect = id
    this.onTabChange()
  }

  openCreateClass(): any {
    if (this.tabActive === 0) {
      event.emit('EDIT_CLASS_OPEN')
    }
    // 检测是否有选择
    if (this.tabActive === 1 && this.oneSelect === -1) {
      return this.message.error($t('_sel1'))
    }
    if (this.tabActive === 2 && this.twoSelect === -1) {
      return this.message.error($t('_sel2'))
    }
    const ids = [-1, this.oneSelect, this.twoSelect]
    event.emit('EDIT_CLASS_OPEN', {
      id: ids[this.tabActive],
    })
  }

  openEditClass(data: any) {
    event.emit('EDIT_CLASS_OPEN', {
      ...data,
    })
  }

  handleSync() {
    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.syncLoading = true

        updateFileContent({
          message: 'update db',
          content: JSON.stringify(
            cleanWebAttrs(JSON.parse(JSON.stringify(this.websiteList)))
          ),
          path: DB_PATH,
        })
          .then(() => {
            this.message.success($t('_syncSuccessTip'))
          })
          .finally(() => {
            this.syncLoading = false
          })
      },
    })
  }
}
