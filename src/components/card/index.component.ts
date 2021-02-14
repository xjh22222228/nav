// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { getToken } from '../../utils/user'
import { setWebsiteList, getLogoUrl, copyText } from '../../utils'
import { websiteList } from '../../store'
import { INavProps, ITagProp, INavFourProp } from '../../types'
import * as __tag from '../../../data/tag.json'

const tagMap: ITagProp = (__tag as any).default

@Component({
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class CardComponent implements OnInit {
  @Input() dataSource: INavFourProp

  validateForm!: FormGroup;
  objectKeys = Object.keys
  websiteList: INavProps[] = websiteList
  isLogin: boolean = !!getToken()
  showModal = false
  iconUrl = ''
  copyUrlDone = false
  copyPathDone = false
  tagMap = tagMap

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: [this.dataSource.name, [Validators.required]],
      url: [this.dataSource.url, [Validators.required]],
      icon: [this.dataSource.icon || null],
      desc: [this.dataSource.desc || ''],
    });
  }

  async onUrlBlur(e) {
    const res = await getLogoUrl(e.target?.value)
    this.iconUrl = (res || '') as string
    this.validateForm.get('icon')!.setValue(res || '')
  }

  async copyUrl(e, type: number) {
    const w = this.dataSource
    const { origin, hash, pathname } = window.location
    const pathUrl = `${origin}${pathname}${hash}?q=${w.name}&url=${encodeURIComponent(w.url)}`
    const isDone = await copyText(e, type === 1 ? pathUrl : w.url)

    if (type === 1) {
      this.copyPathDone = isDone
    } else {
      this.copyUrlDone = isDone
    }
  }

  copyMouseout() {
    this.copyUrlDone = false
    this.copyPathDone = false
  }

  onIconBlur(e) {
    this.iconUrl = e.target.value
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
      let { title, icon, url, desc } = this.validateForm.value

      if (!title) return
      title = title.trim()

      this.dataSource.name = title
      this.dataSource.icon = icon
      this.dataSource.url = url
      this.dataSource.desc = desc
      
      setWebsiteList(this.websiteList)
      this.message.success('修改成功')
      this.toggleModal()
    } catch (err) {
      this.notification.error('内部异常', err.message)
    }
  }

  confirmDel() {}
}
