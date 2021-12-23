// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { getToken } from '../../utils/user'
import { setWebsiteList, copyText, deleteByWeb, getTextContent, updateByWeb } from '../../utils'
import { websiteList } from '../../store'
import { INavProps, ITagProp, INavFourProp } from '../../types'
import * as __tag from '../../../data/tag.json'
import { $t } from '../../locale'
import { MoveSiteComponent } from '../move-site/index.component'
import { settings } from 'src/store'

const tagMap: ITagProp = (__tag as any).default

@Component({
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() dataSource: INavFourProp
  @Input() indexs: Array<number>

  @ViewChildren(MoveSiteComponent)
  moveSiteChild: QueryList<MoveSiteComponent>

  $t = $t
  objectKeys = Object.keys
  settings = settings
  websiteList: INavProps[] = websiteList
  isLogin: boolean = !!getToken()
  showCreateModal = false
  showMoveModal = false
  copyUrlDone = false
  copyPathDone = false
  tagMap = tagMap

  constructor(
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
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

  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal
  }

  toggleMoveModal() {
    this.showMoveModal = !this.showMoveModal
  }

  onRateChange(n: number) {
    this.dataSource.rate = n
    setWebsiteList(this.websiteList)
  }

  handleUpdateSiteOk(payload: INavFourProp) {
    updateByWeb({
      ...this.dataSource,
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc)
    }, payload)

    const keys = Object.keys(payload)
    for (let k of keys) {
      this.dataSource[k] = payload[k]
    }

    this.message.success($t('_modifySuccess'))
    this.toggleCreateModal()
  }

  confirmDel() {
    deleteByWeb({
      ...this.dataSource,
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc)
    })
  }

  handleMove() {
    this.moveSiteChild.changes.subscribe((comps: QueryList<MoveSiteComponent>) =>
    {
      comps.first?.pushMoveSites([this.dataSource])
    });
    this.showMoveModal = true
  }
}
