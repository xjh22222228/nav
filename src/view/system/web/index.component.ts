// @ts-nocheck
// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { INavProps, INavTwoProp, INavThreeProp, IWebProps } from 'src/types'
import {
  websiteList,
  settings,
  searchEngineList,
  tagList,
  tagMap,
  internal,
} from 'src/store'
import { isLogin, removeWebsite } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { getTextContent } from 'src/utils'
import { setWebsiteList, deleteByWeb } from 'src/utils/web'
import { updateFileContent } from 'src/api'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import { $t } from 'src/locale'
import { saveAs } from 'file-saver'
import event from 'src/utils/mitt'
import config from '../../../../nav.config.json'

@Component({
  selector: 'app-admin',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class WebpComponent {
  $t = $t
  settings = settings
  internal = internal
  validateForm!: FormGroup
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
  tagMap = tagMap
  objectKeys = Object.keys

  twoTableData: INavTwoProp[] = []
  threeTableData: INavThreeProp[] = []
  websiteTableData: IWebProps[] = []

  checkedAll = false
  setOfCheckedId = new Set<string>()

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      icon: [''],
      ownVisible: [false],
    })
  }

  ngOnInit() {}

  getAllErrorWeb() {
    this.oneSelect = ''
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
    this.websiteTableData = []
    const websiteTableData = []
    function r(nav) {
      if (!Array.isArray(nav)) return

      for (let i = 0; i < nav.length; i++) {
        const item = nav[i]
        if (item.url && item.ok === false) {
          websiteTableData.push(item)
        } else {
          r(item.nav)
        }
      }
    }
    r(this.websiteList)
    this.websiteTableData = websiteTableData
    if (websiteTableData.length <= 0) {
      this.message.success('未发现异常网站！')
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
          this.twoTableData = this.twoTableData.filter((item) => {
            return !this.setOfCheckedId.has(item.title as string)
          })
          const idx = this.websiteList.findIndex(
            (item) => item.title === this.oneSelect
          )
          if (idx >= 0) {
            this.websiteList[idx].nav = this.twoTableData
          }
        }
        break

      case 3:
        {
          this.threeTableData = this.threeTableData.filter((item) => {
            return !this.setOfCheckedId.has(item.title as string)
          })
          const idx = this.websiteList.findIndex(
            (item) => item.title === this.oneSelect
          )
          if (idx >= 0) {
            const idx2 = this.websiteList[idx].nav.findIndex(
              (item) => item.title === this.twoSelect
            )
            if (idx2 >= 0) {
              this.websiteList[idx].nav[idx2].nav = this.threeTableData
            }
          }
        }
        break

      case 4:
        {
          const deleteData = []
          this.websiteTableData = this.websiteTableData.filter((item) => {
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
        removeWebsite()
        window.localStorage.removeItem(STORAGE_KEY_MAP.s_url)
        setTimeout(() => {
          window.location.reload()
        }, 500)
      },
    })
  }

  handleDownloadBackup() {
    const params = {
      webs: this.websiteList,
      settings,
      tagList,
      searchEngineList,
    }
    const value = JSON.stringify(params)
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'backups_nav.json')
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
        that.websiteList = JSON.parse(result).webs
        setWebsiteList(that.websiteList)
        e.target.value = ''
        that.message.success($t('_actionSuccess'))
      } catch (error: any) {
        that.notification.error($t('_error'), error.message)
      }
    }
  }

  goBack() {
    history.go(-1)
  }

  openMoveWebModal(data: any, index: number, level?: number) {
    const oneIndex = this.websiteList.findIndex(
      (item) => item.title === this.oneSelect
    )
    const twoIndex = this.twoTableData.findIndex(
      (item) => item.title === this.twoSelect
    )
    const threeIndex = this.threeTableData.findIndex(
      (item) => item.title === this.threeSelect
    )
    event.emit('MOVE_WEB', {
      indexs: [oneIndex, twoIndex, threeIndex, index],
      data: [data],
      level,
    })
  }

  openCreateWebModal() {
    if (this.tabActive === 3 && !this.threeSelect) {
      return this.message.error($t('_sel3'))
    }
    const oneIndex = this.websiteList.findIndex(
      (item) => item.title === this.oneSelect
    )
    const twoIndex = this.twoTableData.findIndex(
      (item) => item.title === this.twoSelect
    )
    const threeIndex = this.threeTableData.findIndex(
      (item) => item.title === this.threeSelect
    )
    event.emit('CREATE_WEB', {
      oneIndex,
      twoIndex,
      threeIndex,
    })
  }

  openEditModal(detail: IWebProps) {
    event.emit('CREATE_WEB', {
      detail,
    })
  }

  toggleCreateModal() {
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
    this.showCreateModal = !this.showCreateModal
    this.validateForm.reset()
  }

  onTabChange(index?: number) {
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

  // 拖拽一级分类
  dropOne(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.websiteList, event.previousIndex, event.currentIndex)
    setWebsiteList(this.websiteList)
  }

  // 拖拽二级分类
  dropTwo(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.twoTableData, event.previousIndex, event.currentIndex)
    setWebsiteList(this.websiteList)
  }

  // 删除二级分类
  handleConfirmDelTwo(idx: number) {
    this.twoTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
  }

  // 拖拽三级分类
  dropThree(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.threeTableData,
      event.previousIndex,
      event.currentIndex
    )
    setWebsiteList(this.websiteList)
  }

  // 删除三级分类
  handleConfirmDelThree(idx: number) {
    this.threeTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
  }

  // 拖拽网站
  dropWebsite(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.websiteTableData,
      event.previousIndex,
      event.currentIndex
    )
    setWebsiteList(this.websiteList)
  }

  // 删除网站
  handleConfirmDelWebsite(data: any, idx: number) {
    this.websiteTableData.splice(idx, 1)
    deleteByWeb({
      ...data,
      name: getTextContent(data.name),
      desc: getTextContent(data.desc),
    })
    this.message.success($t('_delSuccess'))
  }

  hanldeOneSelect(value: any) {
    this.oneSelect = value
    const findItem = this.websiteList.find((item) => item.title === value)
    if (findItem) {
      this.twoTableData = findItem.nav
    }
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeTwoSelect(value: any) {
    this.twoSelect = value
    const findItem = this.twoTableData.find((item) => item.title === value)
    if (findItem) {
      this.threeTableData = findItem.nav
    }
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeThreeSelect(value: any) {
    this.threeSelect = value
    const findItem = this.threeTableData.find((item) => item.title === value)
    if (findItem) {
      this.websiteTableData = findItem.nav
    }
    this.onTabChange()
  }

  handleEditBtn(data: any, editIdx: number) {
    let { title, icon, name, ownVisible } = data
    this.toggleCreateModal()
    this.isEdit = true
    this.editIdx = editIdx
    this.validateForm.get('title')!.setValue(title || name || '')
    this.validateForm.get('icon')!.setValue(icon || '')
    this.validateForm.get('ownVisible')!.setValue(!!ownVisible)
  }

  onChangeFile(data: any) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  get iconUrl(): string {
    return this.validateForm.get('icon')?.value || ''
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

  handleOk() {
    const createdAt = Date.now()

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    let { title, icon, ownVisible } = this.validateForm.value

    if (!title || !title.trim()) {
      this.message.error('分类名称不能为空')
      return
    }
    title = title.trim()

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

    this.validateForm.reset()
    this.toggleCreateModal()
    setWebsiteList(this.websiteList)
  }
}
