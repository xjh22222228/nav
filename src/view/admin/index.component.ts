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
import { setWebsiteList, getLogoUrl } from '../../utils'
import { updateFileContent } from '../../services'
import { DB_PATH } from '../../constants'
import * as __tag from '../../../data/tag.json'
import config from '../../../nav.config'

const tagMap: ITagProp = (__tag as any).default
const tagKeys = Object.keys(tagMap)

@Component({
  selector: 'app-admin',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class WebpComponent {
  validateForm!: FormGroup;
  websiteList: INavProps[] = websiteList
  gitRepoUrl = config.gitRepoUrl
  isLogin = !!getToken()
  showCreateModal = false
  syncLoading = false
  tabActive = 0
  editIdx = 0
  isEdit = false
  oneSelect = ''
  twoSelect = ''
  threeSelect = ''
  iconUrl = ''
  urlArr = []
  tags = tagKeys
  tagMap = tagMap
  objectKeys = Object.keys

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
      url: ['', [Validators.required]],
      url0: [''],
      url1: [''],
      url2: [''],
      tagVal0: [tagKeys[0]],
      tagVal1: [tagKeys[0]],
      tagVal2: [tagKeys[0]],
      icon: [''],
      desc: [''],
    });
  }

  addMoreUrl() {
    this.urlArr.push(null)
  }

  lessMoreUrl() {
    this.urlArr.pop()
  }

  handleReset() {
    this.modal.info({
      nzTitle: '重置初始数据',
      nzOkText: '确定重置',
      nzContent: '所有数据将还原初始状态，不可撤销！',
      nzOnOk: () => {
        this.message.success('数据已重置回初始状态')
        window.localStorage.removeItem('website')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    });
  }

  goBack() {
    history.go(-1)
  }

  toggleCreateModal() {
    // 检测是否有选择
    if (!this.showCreateModal) {
      if (this.tabActive === 1 && !this.oneSelect) {
        return this.message.error('请选择一级分类')
      }
      if (this.tabActive === 2 && !this.twoSelect) {
        return this.message.error('请选择二级分类')
      }
      if (this.tabActive === 3 && !this.threeSelect) {
        return this.message.error('请选择三级分类')
      }
    }

    this.isEdit = false
    this.showCreateModal = !this.showCreateModal
    this.validateForm.reset()
    this.urlArr = []
  }

  onTabChange(index: number) {
    this.tabActive = index
  }

  // 删除一级分类
  handleConfirmDelOne(idx) {
    if (this.websiteList.length === 1) {
      return this.message.error('至少保留一项，请先添加!')
    }

    this.websiteList.splice(idx, 1)
    this.message.success('删除成功')
    setWebsiteList(this.websiteList)
  }

  // 拖拽一级分类
  dropOne(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.websiteList, event.previousIndex, event.currentIndex);
    setWebsiteList(this.websiteList)
  }

  // 拖拽二级分类
  dropTwo(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.twoTableData, event.previousIndex, event.currentIndex);
    setWebsiteList(this.websiteList)
  }

  // 删除二级分类
  handleConfirmDelTwo(idx) {
    if (this.twoTableData.length === 1) {
      return this.message.error('至少保留一项，请先添加!');
    }

    this.twoTableData.splice(idx, 1)
    this.message.success('删除成功')
    setWebsiteList(this.websiteList)
  }

  // 拖拽三级分类
  dropThree(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.threeTableData, event.previousIndex, event.currentIndex);
    setWebsiteList(this.websiteList)
  }

  // 删除三级分类
  handleConfirmDelThree(idx) {
    if (this.threeTableData.length === 1) {
      return this.message.error('至少保留一项，请先添加!');
    }

    this.threeTableData.splice(idx, 1)
    this.message.success('删除成功')
    setWebsiteList(this.websiteList)
  }

  // 拖拽网站
  dropWebsite(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.websiteTableData, event.previousIndex, event.currentIndex);
    setWebsiteList(this.websiteList)
  }

  // 删除网站
  handleConfirmDelWebsite(idx) {
    if (this.websiteTableData.length === 1) {
      return this.message.error('至少保留一项，请先添加!');
    }

    this.websiteTableData.splice(idx, 1)
    this.message.success('删除成功')
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

  async onUrlBlur(e) {
    const res = await getLogoUrl(e.target?.value)
    this.iconUrl = (res || '') as string
    this.validateForm.get('icon')!.setValue(res || '')
  }

  onIconBlur(e) {
    this.iconUrl = e.target.value
  }

  handleEditBtn(data, editIdx) {
    let { title, icon, url, desc, name, urls } = data
    this.toggleCreateModal()
    this.isEdit = true
    this.editIdx = editIdx
    this.urlArr = []
    this.validateForm.get('title')!.setValue(title || name || '')
    this.validateForm.get('icon')!.setValue(icon || '')
    this.validateForm.get('url')!.setValue(url || '')
    this.validateForm.get('desc')!.setValue(desc || '')

    if (typeof urls === 'object') {
      let i = 0
      for (let k in urls) {
        this.urlArr.push(null)
        this.validateForm.get(`url${i}`)!.setValue(urls[k])
        this.validateForm.get(`tagVal${i}`)!.setValue(k)
        i++
      }
    }
  }

  handleSync() {
    this.modal.info({
      nzTitle: '同步数据到远端',
      nzOkText: '确定同步',
      nzContent: '确定将所有数据同步到远端吗？这可能需要消耗一定的时间。',
      nzOnOk: () => {
        this.syncLoading = true;

        updateFileContent({
          message: 'update db',
          content: JSON.stringify(this.websiteList),
          path: DB_PATH
        })
        .then(() => {
          this.message.success('同步成功, 大约需要5分钟构建时间')
        })
        .catch(res => {
          this.notification.error(
            `错误: ${res?.response?.status ?? 401}`,
            '同步失败, 请重试'
          )
        })
        .finally(() => {
          this.syncLoading = false
        })
      }
    });
  }

  handleOk() {
    const now = new Date()
    const createdAt = now.toISOString()

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const urls = {}
    let {
      title,
      icon,
      url,
      desc,
      tagVal0,
      tagVal1,
      tagVal2,
      url0,
      url1,
      url2
    } = this.validateForm.value

    if (tagVal0 && url0) {
      urls[tagVal0] = url0
    }
    if (tagVal1 && url1) {
      urls[tagVal1] = url1
    }
    if (tagVal2 && url2) {
      urls[tagVal2] = url2
    }

    if (!title) {
      return
    }

    if (this.isEdit) {
      switch (this.tabActive) {
        // 编辑一级分类
        case 0: {
          this.websiteList[this.editIdx].title = title
          this.websiteList[this.editIdx].icon = icon
        }
          break
  
        // 编辑二级分类
        case 1: {
          this.twoTableData[this.editIdx].title = title
          this.twoTableData[this.editIdx].icon = icon
        }
          break
  
        // 编辑三级分类
        case 2: {
          this.threeTableData[this.editIdx].title = title
          this.threeTableData[this.editIdx].icon = icon
        }
          break
  
        // 编辑网站
        case 3: {
          if (!url) return
          this.websiteTableData[this.editIdx].name = title
          this.websiteTableData[this.editIdx].desc = desc
          this.websiteTableData[this.editIdx].url = url
          this.websiteTableData[this.editIdx].icon = icon
          this.websiteTableData[this.editIdx].urls = urls
        }
          break
      }

      this.message.success('保存成功!')
    } else {
      switch (this.tabActive) {
        // 新增一级分类
        case 0: {
          const exists = this.websiteList.some(item => item.title === title)
          if (exists) {
            return this.message.error('请不要重复添加')
          }
  
          this.websiteList.unshift({
            createdAt,
            title,
            icon,
            nav: []
          })
        }
          break
  
        // 新增二级分类
        case 1: {
          const exists = this.twoTableData.some(item => item.title === title)
          if (exists) {
            return this.message.error('请不要重复添加')
          }
  
          this.twoTableData.unshift({
            createdAt,
            title,
            icon,
            nav: []
          })
        }
          break
  
        // 新增三级分类
        case 2: {
          const exists = this.threeTableData.some(item => item.title === title)
          if (exists) {
            return this.message.error('请不要重复添加')
          }
  
          this.threeTableData.unshift({
            createdAt,
            title,
            icon,
            nav: []
          })
        }
          break
  
        // 新增网站
        case 3: {
          if (!url) return
          const exists = this.websiteTableData.some(item => item.name === title)
          if (exists) {
            return this.message.error('请不要重复添加')
          }
  
          this.websiteTableData.unshift({
            createdAt,
            name: title,
            icon,
            url,
            desc,
            urls
          })
        }
          break
      }
      this.message.success('新增成功!')
    }

    this.iconUrl = ''
    this.validateForm.reset()
    this.toggleCreateModal()
    this.urlArr = []
    setWebsiteList(this.websiteList)
  }
}
