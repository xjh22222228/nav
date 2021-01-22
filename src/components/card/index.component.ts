// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { getToken } from '../../utils/user'
import { setWebsiteList, queryString, getLogoUrl, copyText } from '../../utils'
import { websiteList, isEditing } from '../../store'
import { Router } from '@angular/router'
import { setAnnotate } from '../../utils/ripple'
import { INavProps } from '../../types'

enum EditType {
  isOne,
  isTwo,
  isThree,
  isWebsite
}

@Component({
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class CardComponent implements OnInit {
  @Input() oIdx: number
  @Input() twoIdx: number
  @Input() threeIdx: number
  @Input() fourIdx: number
  @Input() dataSource: object

  validateForm!: FormGroup;
  objectKeys = Object.keys
  websiteList: INavProps[] = websiteList
  isLogin: boolean = !!getToken()
  isEditing = isEditing
  showModal = false
  EditType = EditType
  iconUrl = ''
  copyUrlDone = false
  copyPathDone = false

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
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

  async onUrlBlur(e) {
    const res = await getLogoUrl(e.target?.value)
    this.iconUrl = (res || '') as string
    this.validateForm.get('icon')!.setValue(res || '')
  }

  async copyUrl(e, type: number) {
    if (this.fourIdx >= 0) {
      const w = this.websiteList[this.oIdx]
        .nav[this.twoIdx]
        .nav[this.threeIdx]
        .nav[this.fourIdx]
      const { origin, hash, pathname } = window.location
      const pathUrl = `${origin}${pathname}${hash}?q=${w.name}&url=${encodeURIComponent(w.url)}`
      const isDone = await copyText(e, type === 1 ? pathUrl : w.url)

      if (type === 1) {
        this.copyPathDone = isDone
      } else {
        this.copyUrlDone = isDone
      }
    }
  }

  copyMouseout() {
    this.copyUrlDone = false
    this.copyPathDone = false
  }

  onIconBlur(e) {
    this.iconUrl = e.target.value
  }

  hasKeyword() {
    return !!queryString().q
  }

  toggleModal() {
    this.showModal = !this.showModal
  }

  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    try {
      const type = this.getEditType()
      let { title, icon, url, desc } = this.validateForm.value

      if (!title) return
      title = title.trim()
      
      if (type === EditType.isOne) {
        const exists = this.websiteList.some((item, idx) => (
          item.title === title && idx !== this.oIdx
        ))
        if (exists) {
          this.message.error(`已存在 ${title}, 不可重复添加`)
          return
        }
        this.websiteList[this.oIdx].title = title
        this.websiteList[this.oIdx].icon = icon
      }

      if (type === EditType.isTwo) {
        const w = this.websiteList[this.oIdx].nav
        const exists = w.some((item, idx) => (
          item.title === title && idx !== this.twoIdx
        ))
        if (exists) {
          this.message.error(`已存在 ${title}, 不可重复添加`)
          return
        }
        w[this.twoIdx].title = title
        w[this.twoIdx].icon = icon
      }

      if (type === EditType.isThree) {
        const w = this.websiteList[this.oIdx].nav[this.twoIdx].nav
        const exists = w.some((item, idx) => (
          item.title === title && idx !== this.threeIdx
        ))
        if (exists) {
          this.message.error(`已存在 ${title}, 不可重复添加`)
          return
        }
        w[this.threeIdx].title = title
        w[this.threeIdx].icon= icon
      }

      if (type === EditType.isWebsite) {
        const w = this.websiteList[this.oIdx]
          .nav[this.twoIdx]
          .nav[this.threeIdx]
          .nav
        const exists = w.some((item, idx) => (
          item.name === title && idx !== this.fourIdx
        ))
        if (exists) {
          this.message.error(`已存在 ${title}, 不可重复添加`)
          return
        }
        w[this.fourIdx].name = title
        w[this.fourIdx].icon = icon
        w[this.fourIdx].url = url
        w[this.fourIdx].desc = desc
      }

      setWebsiteList(this.websiteList)
      this.message.success('修改成功')
      this.toggleModal()
    } catch (err) {
      this.notification.error('内部异常', err.message)
    }
  }

  clickEdit() {
    this.toggleModal()
    const type = this.getEditType()

    try {
      if (type === EditType.isOne) {
        const { title, icon } = this.websiteList[this.oIdx]
        this.validateForm.get('title')!.setValue(title)
        this.validateForm.get('icon')!.setValue(icon)
      }
  
      if (type === EditType.isTwo) {
        const { title, icon } = this.websiteList[this.oIdx].nav[this.twoIdx]
        this.validateForm.get('title')!.setValue(title)
        this.validateForm.get('icon')!.setValue(icon)
      }
  
      if (type === EditType.isThree) {
        const { title, icon } = this.websiteList[this.oIdx]
          .nav[this.twoIdx]
          .nav[this.threeIdx]
        this.validateForm.get('title')!.setValue(title)
        this.validateForm.get('icon')!.setValue(icon)
      }
  
      if (type === EditType.isWebsite) {
        const { name, icon, url, desc } = this.websiteList[this.oIdx]
          .nav[this.twoIdx]
          .nav[this.threeIdx]
          .nav[this.fourIdx]
        this.validateForm.get('title')!.setValue(name)
        this.validateForm.get('icon')!.setValue(icon)
        this.validateForm.get('url')!.setValue(url)
        this.validateForm.get('desc')!.setValue(desc)
      }
    } catch (err) {
      this.notification.error('内部异常', err.message)
    }
  }

  getEditType() {
    // 删除网站
    if (
      this.oIdx >= 0 &&
      this.twoIdx >= 0 &&
      this.threeIdx >= 0 &&
      this.fourIdx >= 0
    ) {
      return EditType.isWebsite
    } else if (
      this.oIdx >= 0 &&
      this.twoIdx >= 0 &&
      this.threeIdx >= 0
    ) {
      // 编辑三级类目
      return EditType.isThree
    } else if (
      this.oIdx >= 0 &&
      this.twoIdx >= 0
    ) {
      // 编辑二级类目
      return EditType.isTwo
    } else if (this.oIdx >= 0) {
      // 编辑一级类目
      return EditType.isOne
    }
  }

  confirmDel() {
    const { page, id } = queryString()

    try {
      switch (this.getEditType() as EditType) {
        case EditType.isWebsite:
          this.websiteList[this.oIdx].nav[this.twoIdx].nav[this.threeIdx].nav.splice(this.fourIdx, 1)
          break
  
        case EditType.isThree:
          this.websiteList[this.oIdx].nav[this.twoIdx].nav.splice(this.threeIdx, 1)
          break
  
        case EditType.isTwo:
          // 删除二级分类
          if (this.websiteList[this.oIdx]?.nav?.length <= 1) {
            return this.message.error('至少保留一项, 请先添加再删除!')
          }
  
          this.router.navigate([this.router.url.split('?')[0]], {
            queryParams: {
              page,
              id: id > 0 ? id - 1 : 0,
            }
          })
  
          delete this.websiteList[this.oIdx].id
          this.websiteList[this.oIdx].nav.splice(this.twoIdx, 1)
          break
  
        case EditType.isOne:
          if (this.websiteList.length === 1) {
            this.message.error('至少保留一项, 请先添加再删除!')
            return
          }
    
          this.router.navigate([this.router.url.split('?')[0]], {
            queryParams: {
              page: page > 0 ? page - 1 : 0,
              id: 0
            }
          })
          
          this.websiteList.splice(this.oIdx, 1)
          setTimeout(() => {
            setAnnotate()
          }, 100)
          break
      }
  
      setWebsiteList(this.websiteList)
    } catch (err) {
      this.notification.error('内部异常', err.message)
    }
  }
}
