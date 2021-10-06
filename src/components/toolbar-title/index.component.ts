// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { INavThreeProp, INavProps, INavFourProp } from '../../types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { queryString, setWebsiteList } from '../../utils'
import { getToken } from '../../utils/user'
import { websiteList } from '../../store'
import { $t } from 'src/locale'

@Component({
  selector: 'app-toolbar-title',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class ToolbarTitleWebComponent implements OnInit {
  @Input() index: number
  @Input() dataSource: INavThreeProp
  @Input() arrowType: '1'|'2' = '1'
  @Output() onCollapse = new EventEmitter()

  isLogin = !!getToken()
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
      return this.message.error($t('_repeatAdd'))
    }
    w.unshift(payload)
    this.message.success($t('_addSuccess'))
    setWebsiteList(this.websiteList)
    this.toggleCreateModal()
  }
}
