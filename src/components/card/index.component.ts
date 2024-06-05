// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, QueryList } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { getToken } from 'src/utils/user'
import {
  setWebsiteList,
  copyText,
  deleteByWeb,
  getTextContent,
} from 'src/utils'
import { INavProps, ITagProp, IWebProps } from 'src/types'
import * as __tag from '../../../data/tag.json'
import { $t } from 'src/locale'
import { settings, websiteList } from 'src/store'
import event from 'src/utils/mitt'

const tagMap: ITagProp = (__tag as any).default

@Component({
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() dataSource: IWebProps
  @Input() indexs: Array<number>
  @Input() cardStyle: string = 'standard'

  $t = $t
  objectKeys = Object.keys
  settings = settings
  websiteList: INavProps[] = websiteList
  isLogin: boolean = !!getToken()
  copyUrlDone = false
  copyPathDone = false
  tagMap = tagMap

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {}

  async copyUrl(e, type: number) {
    const w = this.dataSource
    const { origin, hash, pathname } = window.location
    const pathUrl = `${origin}${pathname}${hash}?q=${
      w.name
    }&url=${encodeURIComponent(w.url)}`
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

  openCreateWebMoal() {
    event.emit('CREATE_WEB', {
      detail: this.dataSource,
    })
  }

  onRateChange(n: number) {
    this.dataSource.rate = n
    setWebsiteList(this.websiteList)
  }

  confirmDel() {
    deleteByWeb({
      ...this.dataSource,
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc),
    })
  }

  openMoveWebModal() {
    event.emit('MOVE_WEB', {
      indexs: this.indexs,
      data: [this.dataSource],
    })
  }

  get getRate() {
    if (!this.dataSource.rate) {
      return null
    }
    const rate = Number(this.dataSource.rate)
    // 0分不显示
    if (!rate) {
      return null
    }
    return rate.toFixed(1) + '分'
  }
}
