// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { getToken } from '../../utils/user'
import { setWebsiteList, copyText, deleteByWeb } from '../../utils'
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

  objectKeys = Object.keys
  websiteList: INavProps[] = websiteList
  isLogin: boolean = !!getToken()
  showModal = false
  copyUrlDone = false
  copyPathDone = false
  tagMap = tagMap

  constructor(
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {}

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

  toggleModal() {
    this.showModal = !this.showModal
  }

  handleOk(payload: INavFourProp) {
    this.dataSource.name = payload.name
    this.dataSource.createdAt = payload.createdAt
    this.dataSource.desc = payload.desc
    this.dataSource.icon = payload.icon
    this.dataSource.url = payload.url
    this.dataSource.urls = payload.urls
    this.message.success('修改成功!')

    setWebsiteList(this.websiteList)
    this.toggleModal()
  }

  confirmDel() {
    deleteByWeb(this.dataSource)
  }
}
