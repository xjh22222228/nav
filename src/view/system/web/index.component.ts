// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { INavProps, INavTwoProp, INavThreeProp, IWebProps } from 'src/types'
import {
  websiteList,
  settings,
  searchEngineList,
  tagList,
  internal,
  components,
} from 'src/store'
import { isLogin, removeWebsite } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { getTextContent } from 'src/utils'
import { setWebsiteList, deleteByWeb } from 'src/utils/web'
import { updateFileContent } from 'src/api'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import { $t } from 'src/locale'
import { saveAs } from 'file-saver'
import { isSelfDevelop } from 'src/utils/util'
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
import { EditCategoryComponent } from 'src/components/edit-category/index.component'
import event from 'src/utils/mitt'
import config from '../../../../nav.config.json'

@Component({
  standalone: true,
  imports: [
    EditCategoryComponent,
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
  $t = $t
  isSelfDevelop = isSelfDevelop
  settings = settings
  internal = internal
  websiteList: INavProps[] = websiteList
  gitRepoUrl = config.gitRepoUrl
  isLogin = isLogin
  showCreateModal = false
  syncLoading = false
  uploading = false
  tabActive = 0
  editIdx = 0
  isEdit = false
  oneSelect = ''
  twoSelect = ''
  threeSelect = ''

  checkedAll = false
  setOfCheckedId = new Set<string>()
  errorWebs: IWebProps[] = []

  constructor(
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {}

  ngOnInit() {}

  get oneIndex() {
    return this.websiteList.findIndex((item) => item.title === this.oneSelect)
  }

  get twoIndex() {
    try {
      return this.twoTableData.findIndex(
        (item) => item.title === this.twoSelect
      )
    } catch {
      return -1
    }
  }

  get threeIndex() {
    try {
      return this.threeTableData.findIndex(
        (item) => item.title === this.threeSelect
      )
    } catch {
      return -1
    }
  }

  get twoTableData(): INavTwoProp[] {
    try {
      return (
        this.websiteList.find((item) => item.title === this.oneSelect)?.nav ||
        []
      )
    } catch {
      return []
    }
  }

  get threeTableData(): INavThreeProp[] {
    try {
      return (
        this.twoTableData.find((item) => item.title === this.twoSelect)?.nav ||
        []
      )
    } catch {
      return []
    }
  }

  get websiteTableData(): IWebProps[] {
    try {
      const data = this.threeTableData.find(
        (item) => item.title === this.threeSelect
      )
      if (data) {
        return data.nav
      }
      return this.errorWebs
    } catch {
      return this.errorWebs
    }
  }

  getAllErrorWeb() {
    this.oneSelect = ''
    this.twoSelect = ''
    this.threeSelect = ''
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

  onAllChecked(checked: boolean, type: 1 | 2 | 3 | 4) {
    this.setOfCheckedId.clear()
    switch (type) {
      case 1:
        this.websiteList.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.title)
          } else {
            this.setOfCheckedId.delete(item.title)
          }
        })
        break

      case 2:
        this.twoTableData.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.title as string)
          } else {
            this.setOfCheckedId.delete(item.title as string)
          }
        })
        break

      case 3:
        this.threeTableData.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.title as string)
          } else {
            this.setOfCheckedId.delete(item.title as string)
          }
        })
        break

      case 4:
        this.websiteTableData.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.name)
          } else {
            this.setOfCheckedId.delete(item.name)
          }
        })
        break
    }
  }

  onItemChecked(idStr: any, checked: boolean) {
    if (checked) {
      this.setOfCheckedId.add(idStr)
    } else {
      this.setOfCheckedId.delete(idStr)
    }
  }

  onBatchDelete(type: 1 | 2 | 3 | 4) {
    switch (type) {
      case 1:
        this.setOfCheckedId.forEach((value) => {
          const idx = this.websiteList.findIndex((item) => item.title === value)
          if (idx >= 0) {
            this.websiteList.splice(idx, 1)
          }
        })
        break

      case 2:
        {
          if (this.oneIndex >= 0) {
            this.websiteList[this.oneIndex].nav = this.websiteList[
              this.oneIndex
            ].nav.filter((item) => {
              return !this.setOfCheckedId.has(item.title as string)
            })
          }
        }
        break

      case 3:
        {
          if (this.oneIndex >= 0) {
            if (this.twoIndex >= 0) {
              this.websiteList[this.oneIndex].nav[this.twoIndex].nav =
                this.websiteList[this.oneIndex].nav[this.twoIndex].nav.filter(
                  (item) => {
                    return !this.setOfCheckedId.has(item.title as string)
                  }
                )
            }
          }
        }
        break

      case 4:
        {
          const deleteData: IWebProps[] = []
          this.websiteTableData.forEach((item) => {
            const has = !this.setOfCheckedId.has(item.name)
            if (!has) {
              deleteData.push(item)
            }
            return has
          })
          deleteData.forEach((item) => {
            deleteByWeb({
              ...item,
              name: getTextContent(item.name),
              desc: getTextContent(item.desc),
            })
          })
          if (this.errorWebs.length) {
            this.getAllErrorWeb()
          }
          this.message.success($t('_delSuccess'))
        }
        break
    }
    this.onTabChange()
    setWebsiteList(this.websiteList)
  }

  handleReset() {
    this.modal.info({
      nzTitle: $t('_resetInitData'),
      nzContent: $t('_warnReset'),
      nzOnOk: () => {
        this.message.success($t('_actionSuccess'))
        window.localStorage.removeItem(STORAGE_KEY_MAP.s_url)
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
      component: components,
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

  openMoveWebModal(data: any, index: number, level?: number) {
    event.emit('MOVE_WEB', {
      indexs: [this.oneIndex, this.twoIndex, this.threeIndex, index],
      data: [data],
      level,
    })
  }

  openCreateWebModal(): any {
    if (this.tabActive === 3 && !this.threeSelect) {
      return this.message.error($t('_sel3'))
    }
    event.emit('CREATE_WEB', {
      oneIndex: this.oneIndex,
      twoIndex: this.twoIndex,
      threeIndex: this.threeIndex,
    })
  }

  openEditModal(detail: IWebProps) {
    event.emit('CREATE_WEB', {
      detail,
    })
  }

  toggleCreateModal(): any {
    // 检测是否有选择
    if (!this.showCreateModal) {
      if (this.tabActive === 1 && !this.oneSelect) {
        return this.message.error($t('_sel1'))
      }
      if (this.tabActive === 2 && !this.twoSelect) {
        return this.message.error($t('_sel2'))
      }
    }

    this.isEdit = false
    event.emit('EDIT_CATEGORY_OPEN')
  }

  onTabChange(index?: number) {
    this.errorWebs = []
    this.tabActive = index ?? this.tabActive
    this.setOfCheckedId.clear()
    // Fuck hack
    if (!this.checkedAll) {
      setTimeout(() => {
        this.checkedAll = !this.checkedAll
        setTimeout(() => {
          this.checkedAll = !this.checkedAll
        })
      })
    }
  }

  // 删除一级分类
  handleConfirmDelOne(idx: number) {
    this.websiteList.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
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

  // 删除二级分类
  handleConfirmDelTwo(idx: number) {
    this.twoTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
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

  // 删除三级分类
  handleConfirmDelThree(idx: number) {
    this.threeTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
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

  // 删除网站
  handleConfirmDelWebsite(data: any, idx: number) {
    const ok = deleteByWeb(data)
    if (ok) {
      this.message.success($t('_delSuccess'))
      if (this.errorWebs.length) {
        this.getAllErrorWeb()
      }
    }
  }

  hanldeOneSelect(value?: any) {
    this.oneSelect = value ?? this.oneSelect
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeTwoSelect(value?: any) {
    this.twoSelect = value ?? this.twoSelect
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeThreeSelect(value?: any) {
    this.threeSelect = value ?? this.threeSelect
    this.onTabChange()
  }

  handleEditBtn(data: any, editIdx: number) {
    let { title, icon, name, ownVisible } = data
    this.isEdit = true
    this.editIdx = editIdx
    event.emit('EDIT_CATEGORY_OPEN', {
      title: title || name,
      icon: icon,
      ownVisible,
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
          content: JSON.stringify(this.websiteList),
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

  handleOk(payload: any): any {
    const createdAt = Date.now()
    let { title, icon, ownVisible } = payload

    if (this.isEdit) {
      switch (this.tabActive) {
        // 编辑一级分类
        case 0:
          {
            const exists = this.websiteList.some((item) => item.title === title)
            if (exists && this.websiteList[this.editIdx].title !== title) {
              return this.message.error(`${$t('_repeatAdd')} "${title}"`)
            }
            this.websiteList[this.editIdx].title = title
            this.websiteList[this.editIdx].icon = icon
            this.websiteList[this.editIdx].ownVisible = ownVisible
          }
          break

        // 编辑二级分类
        case 1:
          {
            const exists = this.twoTableData.some(
              (item) => item.title === title
            )
            if (exists && this.twoTableData[this.editIdx].title !== title) {
              return this.message.error(`${$t('_repeatAdd')} "${title}"`)
            }
            this.twoTableData[this.editIdx].title = title
            this.twoTableData[this.editIdx].icon = icon
            this.twoTableData[this.editIdx].ownVisible = ownVisible
          }
          break

        // 编辑三级分类
        case 2:
          {
            const exists = this.threeTableData.some(
              (item) => item.title === title
            )
            if (exists && this.threeTableData[this.editIdx].title !== title) {
              return this.message.error(`${$t('_repeatAdd')} "${title}"`)
            }
            this.threeTableData[this.editIdx].title = title
            this.threeTableData[this.editIdx].icon = icon
            this.threeTableData[this.editIdx].ownVisible = ownVisible
          }
          break
      }

      this.message.success($t('_saveSuccess'))
    } else {
      switch (this.tabActive) {
        // 新增一级分类
        case 0:
          {
            const exists = this.websiteList.some((item) => item.title === title)
            if (exists) {
              return this.message.error(`${$t('_repeatAdd')} "${title}"`)
            }

            this.websiteList.unshift({
              createdAt,
              title,
              icon,
              ownVisible,
              nav: [],
            })
          }
          break

        // 新增二级分类
        case 1:
          {
            const exists = this.twoTableData.some(
              (item) => item.title === title
            )
            if (exists) {
              return this.message.error(`${$t('_repeatAdd')} "${title}"`)
            }

            this.twoTableData.unshift({
              createdAt,
              title,
              icon,
              ownVisible,
              nav: [],
            })
          }
          break

        // 新增三级分类
        case 2:
          {
            const exists = this.threeTableData.some(
              (item) => item.title === title
            )
            if (exists) {
              return this.message.error(`${$t('_repeatAdd')} "${title}"`)
            }

            this.threeTableData.unshift({
              createdAt,
              title,
              icon,
              ownVisible,
              nav: [],
            })
          }
          break
      }
      this.message.success($t('_addSuccess'))
    }

    setWebsiteList(this.websiteList)
  }
}
