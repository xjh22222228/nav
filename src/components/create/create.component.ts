// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { setWebsiteList, getLogoUrl } from '../../utils'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { verifyToken } from '../../services'
import { getToken, setToken } from '../../utils/user'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { websiteList } from '../../store'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Input() visible: boolean
  @Output() onCancel = new EventEmitter()

  validateForm!: FormGroup;
  websiteList = websiteList
  twoList = []
  threeList = []
  token = ''
  isLogin = !!getToken()
  radioType: '1'|'2'|'3'|'6' = '6'
  submiting = false
  iconUrl = ''

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      oneSelect: [null, [Validators.required]],
      twoSelect: [null, [Validators.required]],
      threeSelect: [null, [Validators.required]],
      url: [null, [Validators.required]],
      icon: [null],
      desc: [''],
    });
  }

  getTitle() {
    if (!this.isLogin) {
      return '请登录'
    }
    switch (this.radioType) {
      case '1':
        return '新增一级分类'
      case '2':
        return '新增二级分类'
      case '3':
        return '新增三级分类'
      case '6':
        return '新增网站'
    }
  }

  async onUrlBlur(e) {
    const res = await getLogoUrl(e.target?.value)
    this.iconUrl = (res || '') as string
    this.validateForm.get('icon')!.setValue(res || '')
  }

  onIconBlur(e) {
    this.iconUrl = e.target.value
  }

  hanldeOneSelect(value) {
    if (!value) return
    
    const findItem = this.websiteList.find(item => item.title === value);
    this.twoList = findItem.nav
    this.validateForm.get('twoSelect')!.setValue(null)
  }

  hanldeTwoSelect(value) {
    if (!value) return
    const { oneSelect } = this.validateForm.value
    const oIdx = this.websiteList.findIndex(item => item.title === oneSelect)
    const findItem = this.websiteList[oIdx].nav.find(item => item.title === value)
    this.threeList = findItem.nav
    this.validateForm.get('threeSelect')!.setValue(null)
  }

  hanldeCancel() {
    this.onCancel.emit()
  }

  login() {
    if (!this.token || this.token.length < 40) {
      return this.message.error('请填写正确的Token');
    }

    this.submiting = true
    verifyToken(this.token)
      .then(() => {
        setToken(this.token);
        this.message.success('Token验证成功, 2秒后刷新!')
        setTimeout(() => window.location.reload(), 2000)
      })
      .catch(res => {
        this.notification.error('Token 验证失败', res.message as string)
      })
      .finally(() => {
        this.submiting = false
      })
  }

  handleOk() {
    try {
      if (!this.isLogin) {
        return this.login();
      }
  
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
  
      let { title, icon, oneSelect, twoSelect, threeSelect, url, desc } = this.validateForm.value
  
      if (!title) return
      title = title.trim()
  
      if (icon) {
        icon = icon.trim()
      }
  
      switch (this.radioType) {
        // 新增一级分类
        case '1':
          const isExists = this.websiteList.some(item => item.title === title)
  
          if (isExists) {
            this.message.error('请不要重复添加!')
            return
          }
  
          this.websiteList.push({
            title,
            icon,
            nav: []
          })
          break
        
        // 新增二级分类
        case '2': {
          if (!oneSelect) return
          const findIdx = this.websiteList.findIndex(item => item.title === oneSelect)
          const exists = this.websiteList[findIdx].nav.some(item => item.title === title)
          if (exists) {
            this.message.error('请不要重复添加!')
            return
          }
  
          this.websiteList[findIdx].nav.push({
            title,
            icon,
            nav: []
          })
          break
        }

        // 新增三级分类
        case '3':
          if (!oneSelect && !twoSelect) return
          const oIdx = this.websiteList.findIndex(item => item.title === oneSelect)
          const tIdx = this.websiteList[oIdx].nav.findIndex(item => item.title === twoSelect)
          const exists = this.websiteList[oIdx].nav[tIdx].nav.some(item => item.title === title)
          if (exists) {
            this.message.error('请不要重复添加!')
            return
          }
  
          this.websiteList[oIdx].nav[tIdx].nav.unshift({
            title,
            icon,
            nav: []
          })
          break
  
        // 新增网站
        case '6': {
          if (!oneSelect && !twoSelect && !threeSelect && !url) return
          const oIdx = this.websiteList.findIndex(item => item.title === oneSelect)
          const tIdx = this.websiteList[oIdx].nav.findIndex(item => item.title === twoSelect)
          const eIdx = this.websiteList[oIdx].nav[tIdx].nav.findIndex(item => item.title === threeSelect)
          const exists = this.websiteList[oIdx].nav[tIdx].nav[eIdx].nav.some(item => item.name === title)
          if (exists) {
            this.message.error('请不要重复添加!')
            return
          }

          this.websiteList[oIdx].nav[tIdx].nav[eIdx].nav.unshift({
            name: title,
            icon,
            url,
            desc
          })
          break
        }
      }
      
      this.iconUrl = ''
      this.validateForm.reset()
      setWebsiteList(this.websiteList)
      this.message.success('新增成功!')
    } catch (error) {
      this.notification.error('内部异常', error.message)
    }
  }
}
