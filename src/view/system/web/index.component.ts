// Copyright @ 2018-2022 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { INavProps, INavTwoProp, INavThreeProp, INavFourProp } from 'src/types'
import { websiteList } from 'src/store'
import { getToken } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { setWebsiteList } from 'src/utils'
import { updateFileContent } from 'src/services'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import config from '../../../../nav.config'
import { $t } from 'src/locale'
import { tagMap } from 'src/store'
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-admin',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class WebpComponent {
  $t = $t
  validateForm!: FormGroup
  websiteList: INavProps[] = websiteList
  gitRepoUrl = config.gitRepoUrl
  isLogin = !!getToken()
  showCreateModal = false
  showCreateWebModal = false
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
  websiteDetail: INavFourProp|null

  twoTableData: INavTwoProp[] = []
  threeTableData: INavThreeProp[] = []
  websiteTableData: INavFourProp[] = []

  checkedAll = false
  setOfCheckedId = new Set<string>();

  constructor (
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) {}

  ngOnInit () {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      icon: [''],
      ownVisible: [false],
    })
  }

  onAllChecked(checked, type: 1|2|3|4) {
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
        break;

      case 2:
        this.twoTableData.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.title)
          } else {
            this.setOfCheckedId.delete(item.title)
          }
        })
        break;

      case 3:
        this.threeTableData.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.title)
          } else {
            this.setOfCheckedId.delete(item.title)
          }
        })
        break;

      case 4:
        this.websiteTableData.forEach((item) => {
          if (checked) {
            this.setOfCheckedId.add(item.name)
          } else {
            this.setOfCheckedId.delete(item.name)
          }
        })
        break;
    }
  }

  onItemChecked(idStr, checked) {
    if (checked) {
      this.setOfCheckedId.add(idStr)
    } else {
      this.setOfCheckedId.delete(idStr)
    }
  }

  onBatchDelete(type: 1|2|3|4) {
    switch (type) {
      case 1:
        this.setOfCheckedId.forEach(value => {
          const idx = this.websiteList.findIndex(item => item.title === value)
          if (idx >= 0) {
            this.websiteList.splice(idx, 1)
          }
        })
        break;

      case 2: {
        this.twoTableData = this.twoTableData.filter(item => {
          return !this.setOfCheckedId.has(item.title)
        })
        const idx = this.websiteList.findIndex(item => item.title === this.oneSelect)
        if (idx >= 0) {
          this.websiteList[idx].nav = this.twoTableData
        }
      }
        break;

      case 3: {
        this.threeTableData = this.threeTableData.filter(item => {
          return !this.setOfCheckedId.has(item.title)
        })
        const idx = this.websiteList.findIndex(item => item.title === this.oneSelect)
        if (idx >= 0) {
          const idx2 = this.websiteList[idx].nav.findIndex(item => item.title === this.twoSelect)
          if (idx2 >= 0) {
            this.websiteList[idx].nav[idx2].nav = this.threeTableData
          }
        }
      }
        break;

      case 4: {
        this.websiteTableData = this.websiteTableData.filter(item => {
          return !this.setOfCheckedId.has(item.name)
        })
        const idx = this.websiteList.findIndex(item => item.title === this.oneSelect)
        if (idx >= 0) {
          const idx2 = this.websiteList[idx].nav.findIndex(item => item.title === this.twoSelect)
          if (idx2 >= 0) {
            const idx3 = this.websiteList[idx].nav[idx2].nav.findIndex(item => item.title === this.threeSelect)
            if (idx3 >= 0) {
              this.websiteList[idx].nav[idx2].nav[idx3].nav = this.websiteTableData
            }
          }
        }
      }
        break;
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
        window.localStorage.removeItem(STORAGE_KEY_MAP.website)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    })
  }

  handleDownloadBackup() {
    const value = JSON.stringify(this.websiteList)
    const blob = new Blob([value], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "db.json");
  }

  handleUploadBackup(e) {
    const that = this
    const files = e.target.files
    if (files.length <= 0) {
      return
    }
    const file = files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = function(data) {
      try {
        const { result } = data.target
        that.websiteList = JSON.parse(result as string)
        setWebsiteList(that.websiteList)
        e.target.value = '';
        that.message.success($t('_actionSuccess'))
      } catch (error) {
        that.notification.error(
          $t('_error'),
          error.message
        )
      }
    }
  }

  goBack() {
    history.go(-1)
  }

  toggleCreateWebModal() {
    if (this.tabActive === 3 && !this.threeSelect) {
      return this.message.error($t('_sel3'))
    }

    this.websiteDetail = null
    this.showCreateWebModal = !this.showCreateWebModal
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

  onOkCreateWeb(payload: INavFourProp) {
    // 编辑
    if (this.websiteDetail) {
      this.websiteTableData[this.editIdx] = payload
    } else {
      // 创建
      const exists = this.websiteTableData.some(item => item.name === payload.name)
      if (exists) {
        return this.message.error($t('_repeatAdd'))
      }

      this.websiteTableData.unshift(payload)
      this.message.success($t('_addSuccess'))
    }

    setWebsiteList(this.websiteList)
    this.toggleCreateWebModal()
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
  handleConfirmDelOne(idx) {
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
  handleConfirmDelTwo(idx) {
    this.twoTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
  }

  // 拖拽三级分类
  dropThree(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.threeTableData, event.previousIndex, event.currentIndex)
    setWebsiteList(this.websiteList)
  }

  // 删除三级分类
  handleConfirmDelThree(idx) {
    this.threeTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
  }

  // 拖拽网站
  dropWebsite(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.websiteTableData, event.previousIndex, event.currentIndex)
    setWebsiteList(this.websiteList)
  }

  // 删除网站
  handleConfirmDelWebsite(idx) {
    this.websiteTableData.splice(idx, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
  }

  hanldeOneSelect(value) {
    this.oneSelect = value
    const findItem = this.websiteList.find(item => item.title === value)
    this.twoTableData = findItem.nav
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeTwoSelect(value) {
    this.twoSelect = value
    const findItem = this.twoTableData.find(item => item.title === value)
    this.threeTableData = findItem.nav
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeThreeSelect(value) {
    this.threeSelect = value
    const findItem = this.threeTableData.find(item => item.title === value)
    this.websiteTableData = findItem.nav
    this.onTabChange()
  }

  handleEditBtn(data, editIdx) {
    let { title, icon, name } = data
    this.toggleCreateModal()
    this.isEdit = true
    this.editIdx = editIdx
    this.validateForm.get('title')!.setValue(title || name || '')
    this.validateForm.get('icon')!.setValue(icon || '')
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
          path: DB_PATH
        })
        .then(() => {
          this.message.success($t('_syncSuccessTip'))
        })
        .catch(res => {
          this.notification.error(
            `${$t('_error')}: ${res?.response?.status ?? 401}`,
            $t('_syncFailTip')
          )
        })
        .finally(() => {
          this.syncLoading = false
        })
      }
    })
  }

  handleOk() {
    const createdAt = new Date().toISOString()

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    let { title, icon, ownVisible } = this.validateForm.value

    if (!title) return

    if (this.isEdit) {
      switch (this.tabActive) {
        // 编辑一级分类
        case 0: {
          this.websiteList[this.editIdx].title = title
          this.websiteList[this.editIdx].icon = icon
          this.websiteList[this.editIdx].ownVisible = ownVisible
        }
          break
  
        // 编辑二级分类
        case 1: {
          this.twoTableData[this.editIdx].title = title
          this.twoTableData[this.editIdx].icon = icon
          this.twoTableData[this.editIdx].ownVisible = ownVisible
        }
          break
  
        // 编辑三级分类
        case 2: {
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
        case 0: {
          const exists = this.websiteList.some(item => item.title === title)
          if (exists) {
            return this.message.error($t('_repeatAdd'))
          }
  
          this.websiteList.unshift({
            createdAt,
            title,
            icon,
            ownVisible,
            nav: []
          })
        }
          break
  
        // 新增二级分类
        case 1: {
          const exists = this.twoTableData.some(item => item.title === title)
          if (exists) {
            return this.message.error($t('_repeatAdd'))
          }
  
          this.twoTableData.unshift({
            createdAt,
            title,
            icon,
            ownVisible,
            nav: []
          })
        }
          break
  
        // 新增三级分类
        case 2: {
          const exists = this.threeTableData.some(item => item.title === title)
          if (exists) {
            return this.message.error($t('_repeatAdd'))
          }
  
          this.threeTableData.unshift({
            createdAt,
            title,
            icon,
            ownVisible,
            nav: []
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
