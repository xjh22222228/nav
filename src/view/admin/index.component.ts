// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { INavProps, INavTwoProp, INavThreeProp, INavFourProp, ITagProp } from '../../types'
import { websiteList } from '../../store'
import { getToken } from '../../utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { setWebsiteList } from '../../utils'
import { updateFileContent } from '../../services'
import { DB_PATH, LOGO_PATH, LOGO_CDN, STORAGE_KEY_MAP } from '../../constants'
import { parseBookmark } from '../../utils/bookmark'
import * as __tag from '../../../data/tag.json'
import config from '../../../nav.config'
import { $t } from 'src/locale'

const tagMap: ITagProp = (__tag as any).default

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
  LOGO_CDN = LOGO_CDN
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

  onBookChange(e) {
    const that = this
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = function() {
      const html = this.result as string
      const result = parseBookmark(html)
      if (!Array.isArray(result)) {
        that.notification.error(
          $t('_errorBookTip'),
          `${result?.message ?? ''}`
        )
      } else {
        that.message.success($t('_importSuccess'))
        that.websiteList = result
        setWebsiteList(that.websiteList)
        setTimeout(() => window.location.reload(), 2000)
      }
    }
  }

  onLogoChange(e) {
    const that = this
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]

    if (file.type !== 'image/png') {
      return this.message.error($t('_acceptPng'))
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function() {
      that.uploading = true
      const url = (this.result as string).split(',')[1]
      const logoEL = document.querySelector('.logo') as HTMLImageElement
      const tempSrc = logoEL.src
      logoEL.src = this.result as string

      updateFileContent({
        message: 'update logo',
        content: url,
        isEncode: false,
        path: LOGO_PATH,
        branch: 'image'
      }).then(() => {
        that.message.success($t('_updateLogoSuccess'))
      }).catch(res => {
        logoEL.src = tempSrc
        that.notification.error(
          `${$t('_error')}: ${res?.response?.status ?? 401}`,
          `${res?.response?.data?.message ?? $t('_updateLogoFail')}`
        )
      }).finally(() => {
        e.target.value = ''
        that.uploading = false
      })
    }
  }

  handleReset() {
    this.modal.info({
      nzTitle: $t('_resetInitData'),
      nzOkText: $t('_confirmReset'),
      nzContent: $t('_warnReset'),
      nzOnOk: () => {
        this.message.success($t('_resetSuccess'))
        window.localStorage.removeItem(STORAGE_KEY_MAP.website)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    })
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

  onTabChange(index: number) {
    this.tabActive = index
  }

  // 删除一级分类
  handleConfirmDelOne(idx) {
    if (this.websiteList.length === 1) {
      return this.message.error($t('_reserveOne'))
    }

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
    if (this.twoTableData.length === 1) {
      return this.message.error($t('_reserveOne'))
    }

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
    if (this.threeTableData.length === 1) {
      return this.message.error($t('_reserveOne'))
    }

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
    if (this.websiteTableData.length === 1) {
      return this.message.error($t('_reserveOne'))
    }

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
  }

  hanldeTwoSelect(value) {
    this.twoSelect = value
    const findItem = this.twoTableData.find(item => item.title === value)
    this.threeTableData = findItem.nav
    this.threeSelect = ''
  }

  hanldeThreeSelect(value) {
    this.threeSelect = value
    const findItem = this.threeTableData.find(item => item.title === value)
    this.websiteTableData = findItem.nav
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
