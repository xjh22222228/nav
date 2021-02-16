// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { INavThreeProp, INavProps, INavFourProp } from '../../types'
import { NzMessageService } from 'ng-zorro-antd/message'
import * as __tag from '../../../data/tag.json'
import { queryString, setWebsiteList } from '../../utils'
import { websiteList } from '../../store'

@Component({
  selector: 'app-toolbar-title',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class ToolbarTitleWebComponent implements OnInit {
  @Input() index: number
  @Input() dataSource: INavThreeProp
  @Output() onCollapse = new EventEmitter()

  showCreateModal = false
  websiteList: INavProps[] = websiteList

  constructor(
    private message: NzMessageService,
  ) {}

  ngOnInit() {}

  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal
  }

  handleAdd(payload: INavFourProp) {
    const { page, id } = queryString()
    const w = this.websiteList[page].nav[id].nav[this.index].nav
    const exists = w.some(item => item.name === payload.name)
    if (exists) {
      return this.message.error('请不要重复添加')
    }
    w.unshift(payload)
    this.message.success('新增成功!')
    setWebsiteList(this.websiteList)
    this.toggleCreateModal()
  }
}
